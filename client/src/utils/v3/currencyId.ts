import { Currency } from '@baseswapfi/sdk-core'

export function currencyId(currency: Currency): string {
  if (currency.isNative || currency.symbol === 'ETH') return 'ETH'
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
