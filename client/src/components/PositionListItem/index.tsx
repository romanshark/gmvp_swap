import { BigNumber } from '@ethersproject/bignumber'
import { Percent, Price, Token, V3_CORE_FACTORY_ADDRESSES } from '@baseswapfi/sdk-core'
import { Position, computePoolAddress } from '@baseswapfi/v3-sdk2'
import RangeBadge from 'components/Badge/RangeBadge'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import HoverInlineText from 'components/HoverInlineText'
import Loader from 'components/Loader/CircleLoader'
import { RowBetween } from 'components/Row'
import { useToken } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { formatTickPrice } from 'utils/v3/formatTickPrice'
import { unwrappedToken } from 'utils/v3/unwrappedToken'
import { currentTokenMap } from 'config/constants/tokens'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSelectMerklPools } from 'state/user/selectors'
import { useTranslation } from '@pancakeswap/localization'

const StyledBox = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  padding: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 12px;
    padding-right: 12px;
  }
`

const LinkRow = styled(Link)`
  align-items: center;
  display: flex;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.primary};
  padding: 16px;
  text-decoration: none;
  font-weight: 500;

  & > div:not(:first-child) {
    text-align: center;
  }
  :hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt2};
  }
`

const DataLineItem = styled.div`
  font-size: 14px;
`

const RangeLineItem = styled(DataLineItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  width: 100%;
`

// const DoubleArrow = styled.span`
//   font-size: 12px;
//   margin: 0 2px;
//   color: ${({ theme }) => theme.textTertiary};
// `

const RangeText = styled(Text)`
  font-size: 12px !important;
  word-break: break-word;
  padding: 0.25rem 0.25rem;
  border-radius: 12px;
  box-shadow: 0 0 4px #0154fe;
  margin-right: 24px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
`

const FeeTierText = styled(Text)`
  font-size: 10px !important;
  margin-left: 14px !important;
`

const ExtentsText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  display: inline-block;
  line-height: 16px;
  margin-right: 4px !important;
  font-weight: 600;
`

const PrimaryPositionIdData = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  > * {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
  }
`

interface PositionListItemProps {
  token0: string
  token1: string
  tokenId: BigNumber
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
  aprInfo?: { label: string; value: string }[]
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [currentTokenMap.usdc, currentTokenMap.dai]
  if (stables.some((stable) => stable.equals(token0 as any))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(currentTokenMap.wbnb), currentTokenMap.axlwbtc]

  if (bases[8].address.toLowerCase() === token1.address.toLowerCase()) {
    // homeless-- this didn't work my fix above is probably super janky don't use
    // if (bases.some((base) => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

export default function PositionListItem({
  token0: token0Address,
  token1: token1Address,
  tokenId,
  fee: feeAmount,
  liquidity,
  tickLower,
  tickUpper,
}: PositionListItemProps) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0 as any) : undefined
  const currency1 = token1 ? unwrappedToken(token1 as any) : undefined

  const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId]
  const poolAddress = computePoolAddress({
    factoryAddress: v3CoreFactoryAddress,
    tokenA: token0,
    tokenB: token1,
    fee: feeAmount,
  })

  const merklPools = useSelectMerklPools()
  const aprInfo: any[] | undefined = useMemo(() => merklPools.find((p) => p.pool === poolAddress)?.aprs, [merklPools])

  const router = useRouter()
  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const positionSummaryLink = `/positions/${tokenId}`

  const removed = liquidity?.eq(0)

  return (
    <>
      <StyledBox
        onClick={() => {
          router.replace({
            pathname: positionSummaryLink,
          })
        }}
      >
        <RowBetween>
          <PrimaryPositionIdData>
            <Flex alignItems="center">
              <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={48} margin />
              <Text fontSize="1.5rem">
                &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
              </Text>
            </Flex>

            <FeeTierText>
              <Text>{new Percent(feeAmount, 1_000_000).toSignificant()}%</Text>
            </FeeTierText>
          </PrimaryPositionIdData>

          {aprInfo?.length && <Text>{t(`APR: ~${aprInfo[0].value}`)}</Text>}

          <RangeBadge removed={removed} inRange={!outOfRange} />
        </RowBetween>

        {priceLower && priceUpper ? (
          <RangeLineItem>
            <RangeText>
              <ExtentsText>MIN</ExtentsText>
              <Text fontSize="14px">
                <span>
                  {formatTickPrice({
                    price: priceLower,
                    atLimit: tickAtLimit,
                    direction: Bound.LOWER,
                  })}{' '}
                </span>
                <HoverInlineText text={currencyQuote?.symbol} /> per{' '}
                <HoverInlineText text={currencyBase?.symbol ?? ''} />
              </Text>
            </RangeText>{' '}
            {/* <HideSmall>
            <DoubleArrow>↔</DoubleArrow>{' '}
          </HideSmall>
          <SmallOnly>
            <DoubleArrow>↔</DoubleArrow>{' '}
          </SmallOnly> */}
            <RangeText>
              <ExtentsText>MAX</ExtentsText>
              <Text fontSize="14px">
                <span>
                  {formatTickPrice({
                    price: priceUpper,
                    atLimit: tickAtLimit,
                    direction: Bound.UPPER,
                  })}{' '}
                </span>
                <HoverInlineText text={currencyQuote?.symbol} /> per{' '}
                <HoverInlineText maxCharacters={10} text={currencyBase?.symbol} />
              </Text>
            </RangeText>
          </RangeLineItem>
        ) : (
          <Loader />
        )}

        {}
      </StyledBox>
    </>
  )
}
