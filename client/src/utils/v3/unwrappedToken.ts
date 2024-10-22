import { Currency } from '@baseswapfi/sdk-core'
import { asSupportedChain } from 'config/constants/chains'
import { WRAPPED_NATIVE_CURRENCY } from 'config/constants/tokens'
import { nativeOnChain } from 'config/constants/tokens-v3'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = asSupportedChain(currency.chainId)
  if (formattedChainId && WRAPPED_NATIVE_CURRENCY[formattedChainId]?.equals(currency)) {
    return nativeOnChain(currency.chainId)
  }

  return currency
}
