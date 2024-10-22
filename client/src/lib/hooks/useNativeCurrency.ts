import { ChainId, NativeCurrency, Token } from '@baseswapfi/sdk-core'
import { nativeOnChain } from 'config/constants/tokens-v3'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from 'utils/providers'

export default function useNativeCurrency(chainId: ChainId | null | undefined): NativeCurrency | Token {
  return useMemo(() => (chainId ? nativeOnChain(chainId) : nativeOnChain(DEFAULT_CHAIN_ID)), [chainId])
}
