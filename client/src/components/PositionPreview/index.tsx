import { Currency } from '@baseswapfi/sdk-core'
import { Position } from '@baseswapfi/v3-sdk2'
import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import RangeBadge from 'components/Badge/RangeBadge'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Break } from 'components/earn/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import RateToggle from 'components/RateToggle'
import { RowBetween, RowFixed } from 'components/Row'
import Trans from 'components/Trans'
import JSBI from 'jsbi'
import { ReactNode, useCallback, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import { useTheme } from 'styled-components'
import { formatTickPrice } from 'utils/v3/formatTickPrice'
import { unwrappedToken } from 'utils/v3/unwrappedToken'

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0,
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0))

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem', marginLeft: '12px', marginRight: '12px', width: '98%' }}>
        <RowFixed>
          <DoubleCurrencyLogo
            currency0={currency0 ?? undefined}
            currency1={currency1 ?? undefined}
            size={24}
            // margin={true}
          />
          <Text ml="10px" fontSize="24px">
            {currency0?.symbol} / {currency1?.symbol}
          </Text>
        </RowFixed>
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard mb="12px">
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <Text ml="8px">{currency0?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">{position.amount0.toSignificant(4)}</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <Text ml="8px">{currency1?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">{position.amount1.toSignificant(4)}</Text>
            </RowFixed>
          </RowBetween>
          <Break />
          <RowBetween>
            <Text>
              <Trans>Fee Tier</Trans>
            </Text>
            <Text>{t(`${position?.pool?.fee / 10000}`)}%</Text>
          </RowBetween>
        </AutoColumn>
      </LightCard>

      <AutoColumn gap="md">
        <RowBetween mb="12px">
          {title ? <Text>{title}</Text> : <div />}
          <RateToggle
            currencyA={sorted ? currency0 : currency1}
            currencyB={sorted ? currency1 : currency0}
            handleRateToggle={handleRateChange}
          />
        </RowBetween>

        <RowBetween>
          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <Text fontSize="12px">
                <Trans>Min Price</Trans>
              </Text>
              <Text textAlign="center">
                {formatTickPrice({
                  price: priceLower,
                  atLimit: ticksAtLimit,
                  direction: Bound.LOWER,
                })}
              </Text>
              <Text textAlign="center" fontSize="12px">
                {t(`${quoteCurrency.symbol} per ${baseCurrency.symbol}`)}
              </Text>
              <Text textAlign="center" color={theme.colors.tertiary} style={{ marginTop: '4px' }}>
                {t(`Your position will be 100% composed of ${baseCurrency?.symbol} at this price`)}
              </Text>
            </AutoColumn>
          </LightCard>

          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <Text fontSize="12px">
                <Trans>Max Price</Trans>
              </Text>
              <Text textAlign="center">
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: ticksAtLimit,
                  direction: Bound.UPPER,
                })}
              </Text>
              <Text textAlign="center" fontSize="12px">
                {t(`${quoteCurrency.symbol} per ${baseCurrency.symbol}`)}
              </Text>
              <Text textAlign="center" color={theme.colors.tertiary} style={{ marginTop: '4px' }}>
                {t(`Your position will be 100% composed of ${quoteCurrency?.symbol} at this price`)}
              </Text>
            </AutoColumn>
          </LightCard>
        </RowBetween>
        <LightCard padding="12px" mt="12px">
          <AutoColumn gap="4px" justify="center">
            <Text fontSize="12px">
              <Trans>Current price</Trans>
            </Text>
            <Text>{`${price.toSignificant(5)} `}</Text>
            <Text textAlign="center" fontSize="12px">
              {t(`${quoteCurrency.symbol} per ${baseCurrency.symbol}`)}
            </Text>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  )
}
