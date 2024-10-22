import { Currency } from '@baseswapfi/sdk-core'
import { useTranslation } from '@pancakeswap/localization'
import { ToggleElement, ToggleWrapper } from 'components/Toggle/MultiToggle'

// the order of displayed base currencies from left to right is always in sort order
// currencyA is treated as the preferred base currency
export default function RateToggle({
  currencyA,
  currencyB,
  handleRateToggle,
}: {
  currencyA: Currency
  currencyB: Currency
  handleRateToggle: () => void
}) {
  const { t } = useTranslation()
  const tokenA = currencyA?.wrapped
  const tokenB = currencyB?.wrapped

  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  return tokenA && tokenB ? (
    <div
      style={{ width: 'fit-content', display: 'flex', alignItems: 'center', margin: '5px' }}
      onClick={handleRateToggle}
    >
      <ToggleWrapper width="fit-content">
        <ToggleElement isActive={isSorted} fontSize="12px">
          {t(`${isSorted ? currencyA.symbol : currencyA.symbol}`)}
        </ToggleElement>
        <ToggleElement isActive={!isSorted} fontSize="12px">
          {t(`${isSorted ? currencyB.symbol : currencyB.symbol}`)}
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}
