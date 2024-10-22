import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Currency, CurrencyAmount, Percent, Price, Token } from '@baseswapfi/sdk-core'
import { NonfungiblePositionManager, Pool, Position } from '@baseswapfi/v3-sdk2'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Badge from 'components/Badge'
import { Button, Text, Card, Box, Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { LoadingFullscreen } from 'components/Loader/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { RowBetween, RowFixed } from 'components/Row'
import { Dots } from 'components/swap/styled'
import Toggle from 'components/Toggle'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'config/constants/chains'
import { isGqlSupportedChain } from 'graphql/data/util'
import { useToken } from 'hooks/Tokens'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { PoolState, usePool } from 'hooks/v3/usePools'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import styled, { useTheme } from 'styled-components'
import { currencyId } from 'utils/v3/currencyId'
import { formatCurrencyAmount } from 'utils/v3/formatCurrencyAmount'
import { formatNumber, formatPrice, NumberType } from 'utils/v3/formatNumbers'
import { formatTickPrice } from 'utils/v3/formatTickPrice'
import { unwrappedToken } from 'utils/v3/unwrappedToken'

import RangeBadge from 'components/Badge/RangeBadge'
import { getPriceOrderingFromPositionForUI } from 'components/PositionListItem'
import RateToggle from 'components/RateToggle'
import { usePositionTokenURI } from 'hooks/v3/usePositionTokenURI'
import { TransactionType } from 'state/transactions/types'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { LoadingRows } from './styled'
import Trans from 'components/Trans'
import { useTranslation } from '@pancakeswap/localization'
import { ExternalLink } from 'react-feather'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Page from 'views/Page'
import useTokenPrices from 'hooks/useTokenPrices'
import { FiArrowLeftCircle } from 'react-icons/fi'

const getTokenLink = (chainId: ChainId, address: string) => {
  if (isGqlSupportedChain(chainId)) {
    const chainName = CHAIN_IDS_TO_NAMES[chainId]
    return `${window.location.origin}/#/tokens/${chainName}/${address}`
  } else {
    return getExplorerLink(chainId, address, ExplorerDataType.TOKEN)
  }
}

export const DarkCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
`
export const MainCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  margin-bottom: 1rem;
  border-width: 3px;
`

const PositionPageButtonPrimary = styled(Button)`
  width: 228px;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 12px;
`

const PageWrapper = styled.div`
  padding: 68px 16px 16px 16px;

  min-width: 800px;
  max-width: 1280px;
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
`

// responsive text
// disable the warning because we don't use the end prop, we just want to filter it out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Label = styled(({ end, ...props }) => <Text {...props} />)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  text-align: center;
  margin-right: 0px;
  font-weight: 500;
`

const HoverText = styled(Text)`
  text-decoration: none;
  font-size: 1.2rem;
  text-transform: uppercase;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.background};
  :hover {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
  }
`

const DoubleArrow = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  margin: 0 1rem;
`
// const ResponsiveRow = styled(RowBetween)`
//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     flex-direction: column;
//     align-items: flex-start;
//     row-gap: 16px;
//     width: 100%;
//   }
// `

const ResponsiveRow = styled(RowBetween)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

// const ActionButtonResponsiveRow = styled(ResponsiveRow)`
//   width: 50%;
//   justify-content: flex-end;

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     width: 100%;
//     flex-direction: row;
//     * {
//       width: 100%;
//     }
//   }
// `

const ActionButtonResponsiveRow = styled(ResponsiveRow)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0px;
  }
`

const RowFixedTop = styled(RowFixed)`
  display: flex;
  flex-direction: column;
 
  }
`

// const ResponsiveButtonConfirmed = styled(Button)`
//   border-radius: 12px;
//   padding: 6px 8px;
//   width: fit-content;
//   font-size: 16px;

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
//     width: fit-content;
//   }

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     width: fit-content;
//   }
// `

const ResponsiveButtonConfirmed = styled(Button)`
  border-radius: 12px;
  padding: 6px 8px;
  width: fit-content;
  font-size: 16px;
`

const NFTGrid = styled.div`
  display: grid;
  grid-template: 'overlap';
  min-height: 400px;
  padding: 12px;
`

const NFTCanvas = styled.canvas`
  grid-area: overlap;
  border-radius: 32px;
  box-shadow: 0 4px 10px #fff, 0 -8px 16px #68b9ff, 12px 0px 16px #0154fd, -12px 0px 16px #0154fd;
`

const NFTImage = styled.img`
  grid-area: overlap;

  height: 400px;
  /* Ensures SVG appears on top of canvas. */
  z-index: 1;
`

function CurrentPriceCard({
  inverted,
  pool,
  currencyQuote,
  currencyBase,
}: {
  inverted?: boolean
  pool?: Pool | null
  currencyQuote?: Currency
  currencyBase?: Currency
}) {
  if (!pool || !currencyQuote || !currencyBase) {
    return null
  }

  const { t } = useTranslation()

  return (
    <>
      <Text textAlign="center" color="primaryBright">
        CURRENT PRICE:&nbsp;
        {formatPrice(inverted ? pool.token1Price : pool.token0Price, NumberType.TokenTx)}&nbsp;
        {t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}
      </Text>
    </>
  )
}

function LinkedCurrency({ chainId, currency }: { chainId?: number; currency?: Currency }) {
  const address = (currency as Token)?.address

  if (typeof chainId === 'number' && address) {
    return (
      <a href={getTokenLink(chainId, address)} target="_blank">
        <RowFixed>
          <CurrencyLogo currency={currency} size="30px" style={{ marginRight: '0.5rem' }} />
          <Text fontSize="1.4rem">
            {currency?.symbol}
            {/* ↗ */}
          </Text>
          <ExternalLink size={16} style={{ marginLeft: 4 }} />
        </RowFixed>
      </a>
    )
  }

  return (
    <RowFixed>
      <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '0.5rem' }} />
      <Text>{currency?.symbol}</Text>
    </RowFixed>
  )
}

function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>,
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(15))
    const b = Number.parseFloat(upper.toSignificant(15))
    const c = Number.parseFloat(current.toSignificant(15))

    const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}

// snapshots a src img into a canvas
function getSnapshot(src: HTMLImageElement, canvas: HTMLCanvasElement, targetHeight: number) {
  const context = canvas.getContext('2d')

  if (context) {
    let { width, height } = src

    // src may be hidden and not have the target dimensions
    const ratio = width / height
    height = targetHeight
    width = Math.round(ratio * targetHeight)

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(devicePixelRatio, devicePixelRatio)

    context.clearRect(0, 0, width, height)
    context.drawImage(src, 0, 0, width, height)
  }
}

function NFT({ image, height: targetHeight, boxShadow }: { image: string; height: number; boxShadow?: string }) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      />
    </NFTGrid>
  )
}

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

export function PositionPageUnsupportedContent() {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Text style={{ marginBottom: '8px' }}>
          <Trans>Position unavailable</Trans>
        </Text>
        <Text style={{ marginBottom: '32px' }}>
          <Trans>To view a position, you must be connected to the network it belongs to.</Trans>
        </Text>
        <Link
          href="/positions"
          style={{
            width: 'fit-content',
          }}
        >
          <Trans>Back to Pools</Trans>
        </Link>
      </div>
    </PageWrapper>
  )
}

export default function PositionPage() {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  if (router.isReady && router.query.tokenId && isSupportedChain(chainId)) {
    return <PositionPageContent />
  }
  return <PositionPageUnsupportedContent />
}

function PositionPageContent() {
  const router = useRouter()
  const tokenIdFromUrl = router.query.tokenId
  const { chainId, account, library: provider } = useActiveWeb3React()
  const theme = useTheme()
  const { t } = useTranslation()

  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const removed = liquidity?.eq(0)

  const metadata = usePositionTokenURI(parsedTokenId)
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined
  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol
  // construct Position from details returned
  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)
  const [manuallyInverted, setManuallyInverted] = useState(false)
  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool.token0Price,
          inverted ? priceLower.invert() : priceUpper,
        )
      : undefined
  }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined
  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)
  const [showConfirm, setShowConfirm] = useState(false)

  const { getTokenPrice } = useTokenPrices()

  const price0 = useMemo(() => getTokenPrice(token0?.address), [getTokenPrice, token0])
  const price1 = useMemo(() => getTokenPrice(token1?.address), [getTokenPrice, token1])

  const fiatValueOfFees: string = useMemo(() => {
    if (!feeValue0 || !feeValue1) return '0'

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0 * parseFloat(feeValue0Wrapped.toFixed() || '0')
    const amount1 = price1 * parseFloat(feeValue1Wrapped.toFixed() || '0')

    return formatNumber(amount0 + amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const fiatValueOfLiquidity: string = useMemo(() => {
    if (!position) return '0'

    const amount0 = price0 * parseFloat(position?.amount0.toFixed() || '0')
    const amount1 = price1 * parseFloat(position?.amount1.toFixed() || '0')

    return formatNumber(amount0 + amount1)
  }, [price0, price1, position])

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract(chainId)
  const collect = useCallback(() => {
    if (
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account,
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

    provider
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            setCollectMigrationHash(response.hash)
            setCollecting(false)

            addTransaction(response, {
              type: TransactionType.COLLECT_FEES,
              currencyId0: currencyId(currency0ForFeeCollectionPurposes),
              currencyId1: currencyId(currency1ForFeeCollectionPurposes),
              expectedCurrencyOwed0:
                feeValue0?.quotient.toString() ??
                CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact(),
              expectedCurrencyOwed1:
                feeValue1?.quotient.toString() ??
                CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact(),
            })
          })
      })
      .catch((error) => {
        setCollecting(false)
        console.error(error)
      })
  }, [
    chainId,
    feeValue0,
    feeValue1,
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    positionManager,
    account,
    tokenId,
    addTransaction,
    provider,
  ])

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  // check if price is within range
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
  const { isMobile } = useMatchBreakpointsContext()

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px' }}>
        <Card padding="12px 16px">
          <AutoColumn gap="md">
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueUpper?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</Text>
              </RowFixed>
              <Text>{feeValueUpper?.currency?.symbol}</Text>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueLower?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</Text>
              </RowFixed>
              <Text>{feeValueLower?.currency?.symbol}</Text>
            </RowBetween>
          </AutoColumn>
        </Card>
        <Text>
          <Trans>Collecting fees will withdraw currently available fees for you.</Trans>
        </Text>
        <Button data-testid="modal-collect-fees-button" onClick={collect}>
          <Trans>Collect</Trans>
        </Button>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    ownsNFT &&
      (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
      currency0 &&
      currency1 &&
      (currency0.isNative || currency1.isNative) &&
      !collectMigrationHash,
  )

  if (!positionDetails && !loading) {
    return <PositionPageUnsupportedContent />
  }

  return loading || poolState === PoolState.LOADING || !feeAmount ? (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  ) : (
    <>
      <Page>
        {showConfirm && (
          <TransactionConfirmationModal
            title={t('Claim fees')}
            onDismiss={() => setShowConfirm(false)}
            attemptingTxn={collecting}
            hash={collectMigrationHash ?? ''}
            // @ts-ignore
            content={() => {
              return <ConfirmationModalContent topContent={modalHeader} bottomContent={null} />
            }}
            // reviewContent={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={null} />}
            pendingText={t(`Collecting fees`)}
          />
        )}
        <AutoColumn gap="sm" style={{ width: '100%', maxWidth: '1000px', marginBottom: '100px' }}>
          <AutoColumn gap="sm">
            <RowBetween>
              <Link
                data-cy="visit-pool"
                style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '1rem', cursor: 'pointer' }}
                href="/positions"
              >
                <HoverText>
                  <Flex justifyContent="flex-start" flexDirection="row" alignItems="center">
                    <FiArrowLeftCircle size="50px" style={{ marginRight: '8px' }} />
                    <Trans>Back to Positions</Trans>
                  </Flex>
                </HoverText>
              </Link>
            </RowBetween>
            <ResponsiveRow mb="24px" mt="-10px">
              <RowFixedTop>
                <Flex alignItems="center" justifyContent="center">
                  <DoubleCurrencyLogo
                    currency0={currencyBase}
                    currency1={currencyQuote}
                    size={isMobile ? 40 : 100}
                    margin
                  />
                  <Flex flexDirection="column">
                    <Text fontSize="1.9rem" mr="10px">
                      &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
                    </Text>
                    <Flex alignItems="center" justifyContent="center">
                      <Badge style={{ marginRight: '8px' }}>
                        <BadgeText>{t(`${new Percent(feeAmount, 1_000_000).toSignificant()}%`)} Fee Tier</BadgeText>
                      </Badge>
                      <RangeBadge removed={removed} inRange={inRange} />
                    </Flex>
                  </Flex>
                </Flex>
              </RowFixedTop>
            </ResponsiveRow>

            {ownsNFT && (
              <ActionButtonResponsiveRow>
                {currency0 && currency1 && feeAmount && tokenId ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.replace({
                        pathname: '/addV3',
                        query: {
                          currencyIdA: currencyId(currency0),
                          currencyIdB: currencyId(currency1),
                          feeAmount,
                          tokenId: tokenId.toNumber(),
                        },
                      })
                    }}
                    style={{ marginRight: '8px', height: '40px' }}
                  >
                    <Trans>Increase Liquidity</Trans>
                  </Button>
                ) : null}
                {tokenId && !removed ? (
                  <Button
                    style={{ height: '40px' }}
                    variant="gasoff"
                    // href={`/removeV3/${tokenId}`}
                    onClick={() => {
                      router.replace({
                        pathname: '/removeV3',
                        query: {
                          tokenId: tokenId.toNumber(),
                        },
                      })
                    }}
                  >
                    <Trans>Remove Liquidity</Trans>
                  </Button>
                ) : null}
              </ActionButtonResponsiveRow>
            )}
          </AutoColumn>
          <ResponsiveRow align="flex-start">
            {metadata?.valid && (
              <Box
                style={{
                  height: '100%',
                  marginRight: 0,
                }}
              >
                {'result' in metadata ? (
                  <Flex
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      minWidth: '340px',
                    }}
                  >
                    <NFT image={metadata.result.image} height={400} />
                    {typeof chainId === 'number' && owner && !ownsNFT ? (
                      <ExternalLink href={getExplorerLink(chainId, owner, ExplorerDataType.ADDRESS)}>
                        <Trans>Owner</Trans>
                      </ExternalLink>
                    ) : null}
                  </Flex>
                ) : (
                  <Card
                    style={{
                      minWidth: '340px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <LoadingFullscreen />
                  </Card>
                )}
              </Box>
            )}
            <AutoColumn gap="sm" style={{ width: '100%', height: '100%' }}>
              <MainCard>
                <AutoColumn gap="md" style={{ width: '100%' }}>
                  <AutoColumn gap="md" style={{ padding: '8px' }}>
                    <Label>
                      <Trans>Liquidity Position: </Trans>
                    </Label>
                    <Text fontSize="42px" color="primaryBright" fontWeight={500}>
                      {t(`$${fiatValueOfLiquidity}`)}
                    </Text>
                  </AutoColumn>
                  <DarkCard padding="8px" margin="4px 18px">
                    <AutoColumn gap="md">
                      <RowBetween mb="8px">
                        <LinkedCurrency chainId={chainId} currency={currencyQuote} />
                        <RowFixed>
                          <Text fontSize="1.2rem">
                            {inverted ? position?.amount0.toSignificant(4) : position?.amount1.toSignificant(4)}
                          </Text>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px' }}>
                              <Text color={theme.colors.text} fontSize={16}>
                                {t(`${inverted ? ratio : 100 - ratio}%`)}
                              </Text>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <LinkedCurrency chainId={chainId} currency={currencyBase} />
                        <RowFixed>
                          <Text fontSize="1.2rem">
                            {inverted ? position?.amount1.toSignificant(4) : position?.amount0.toSignificant(4)}
                          </Text>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px' }}>
                              <Text color={theme.colors.text} fontSize={16}>
                                {t(`${inverted ? 100 - ratio : ratio}%`)}
                              </Text>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                </AutoColumn>
              </MainCard>
              <Card marginBottom="12px" style={{ borderWidth: '3px' }}>
                <AutoColumn gap="md" style={{ width: '100%', padding: '8px' }}>
                  <AutoColumn gap="md">
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <AutoColumn gap="md">
                        <Label>
                          <Trans>Unclaimed fees:</Trans>
                        </Label>
                        <Text color={theme.colors.primaryBright} fontSize="42px" fontWeight={500}>
                          {t(`$${fiatValueOfFees}`)}
                        </Text>
                      </AutoColumn>
                      {ownsNFT && (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash) ? (
                        <ResponsiveButtonConfirmed
                          data-testid="collect-fees-button"
                          disabled={collecting || !!collectMigrationHash}
                          confirmed={!!collectMigrationHash && !isCollectPending}
                          variant="gason"
                          style={{ height: '40px' }}
                          onClick={() => setShowConfirm(true)}
                        >
                          {!!collectMigrationHash && !isCollectPending ? (
                            <Text color={theme.colors.text}>
                              <Trans> Collected</Trans>
                            </Text>
                          ) : isCollectPending || collecting ? (
                            <Text color={theme.colors.text}>
                              {' '}
                              <Dots>
                                <Trans>Collecting</Trans>
                              </Dots>
                            </Text>
                          ) : (
                            <>
                              <Text color={theme.colors.text}>
                                <Trans>Claim fees</Trans>
                              </Text>
                            </>
                          )}
                        </ResponsiveButtonConfirmed>
                      ) : null}
                    </RowBetween>
                  </AutoColumn>
                  <DarkCard paddingX="0rem" paddingY="4px" style={{ borderWidth: '2px' }}>
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingLeft={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={feeValueUpper?.currency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}&nbsp;{' '}
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {' '}
                            {feeValueUpper?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingRight={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={feeValueLower?.currency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}&nbsp;
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {feeValueLower?.currency?.symbol}
                          </Text>
                        </Flex>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                  {showCollectAsWeth && (
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Text>{t(`Collect as ${nativeWrappedSymbol}`)}</Text>
                        <Toggle
                          id="receive-as-weth"
                          isActive={receiveWETH}
                          toggle={() => setReceiveWETH((receive) => !receive)}
                        />
                      </RowBetween>
                    </AutoColumn>
                  )}
                </AutoColumn>
              </Card>

              {/* <Card marginBottom="12px" style={{ borderWidth: '3px' }}>
                <AutoColumn gap="md" style={{ width: '100%', padding: '8px' }}>
                  <AutoColumn gap="md">
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <AutoColumn gap="md">
                        <Label>
                          <Trans>Pending rewards:</Trans>
                        </Label>

                        <Text color={theme.colors.primaryBright} fontSize="42px" fontWeight={500}>
                          {t(`$0`)}
                        </Text>
                      </AutoColumn>
                      {ownsNFT && (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) ? (
                        <ResponsiveButtonConfirmed
                          disabled={collecting || !!collectMigrationHash}
                          confirmed={!!collectMigrationHash && !isCollectPending}
                          variant="gason"
                          style={{ height: '40px' }}
                          // onClick={() => setShowConfirm(true)}
                        >
                          <Text color={theme.colors.text}>
                            <Trans>Claim rewards</Trans>
                          </Text>
                        </ResponsiveButtonConfirmed>
                      ) : null}
                    </RowBetween>
                  </AutoColumn>
                  <DarkCard paddingX="0rem" paddingY="4px" style={{ borderWidth: '2px' }}>
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingLeft={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={feeValueUpper?.currency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}&nbsp;{' '}
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {' '}
                            {feeValueUpper?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingRight={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={feeValueLower?.currency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}&nbsp;
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {feeValueLower?.currency?.symbol}
                          </Text>
                        </Flex>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                </AutoColumn>
              </Card> */}
            </AutoColumn>
          </ResponsiveRow>
          <MainCard padding="8px">
            <AutoColumn gap="md">
              <RowBetween mb="4px">
                <RowFixed>
                  <Label display="flex" style={{ marginRight: '12px' }}>
                    <Trans>PRICE RANGE: </Trans>
                  </Label>
                  <Box>
                    <>
                      <RangeBadge removed={removed} inRange={inRange} />
                      <span style={{ width: '12px' }} />
                    </>
                  </Box>
                </RowFixed>

                <RowFixed>
                  {currencyBase && currencyQuote && (
                    <RateToggle
                      currencyA={currencyBase}
                      currencyB={currencyQuote}
                      handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                    />
                  )}
                </RowFixed>
              </RowBetween>
              <Flex flexDirection="row" justifyContent="center" alignItems="center" mb="4px">
                <CurrentPriceCard
                  inverted={inverted}
                  pool={pool}
                  currencyQuote={currencyQuote}
                  currencyBase={currencyBase}
                />
              </Flex>

              <RowBetween style={{ justifyContent: 'center', marginBottom: '12px', marginTop: '1rem' }}>
                <DarkCard padding="12px">
                  <AutoColumn gap="md" justify="center">
                    <ExtentsText>
                      <Trans>Min Price for Range</Trans>
                    </ExtentsText>
                    <Text textAlign="center" color="background">
                      {formatTickPrice({
                        price: priceLower,
                        atLimit: tickAtLimit,
                        direction: Bound.LOWER,
                        numberType: NumberType.TokenTx,
                      })}
                    </Text>
                    <ExtentsText style={{ fontWeight: '400' }}>
                      {' '}
                      {t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}
                    </ExtentsText>

                    {inRange && (
                      <Text marginTop="1rem" color={theme.colors.background} fontSize="14px">
                        {t(`Your position will be 100% ${currencyBase?.symbol} at this price.`)}
                      </Text>
                    )}
                  </AutoColumn>
                </DarkCard>

                <DoubleArrow>⟷</DoubleArrow>
                <DarkCard padding="12px">
                  <AutoColumn gap="sm" justify="center">
                    <ExtentsText>
                      <Trans>Max Price for Range</Trans>
                    </ExtentsText>
                    <Text color="background" textAlign="center">
                      {formatTickPrice({
                        price: priceUpper,
                        atLimit: tickAtLimit,
                        direction: Bound.UPPER,
                        numberType: NumberType.TokenTx,
                      })}
                    </Text>
                    <ExtentsText style={{ fontWeight: '400' }}>
                      {t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}
                    </ExtentsText>

                    {inRange && (
                      <Text marginTop="1rem" color={theme.colors.background} fontSize="14px">
                        {t(`Your position will be 100% ${currencyQuote?.symbol} at this price.`)}
                      </Text>
                    )}
                  </AutoColumn>
                </DarkCard>
              </RowBetween>
            </AutoColumn>
          </MainCard>
        </AutoColumn>
      </Page>
      {/* <SwitchLocaleLink /> */}
    </>
  )
}
