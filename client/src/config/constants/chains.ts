import { SUPPORTED_CHAINS, SupportedChainsType, ChainId } from '@baseswapfi/sdk-core'

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.BASE]: 'base',
  [ChainId.BASE_GOERLI]: 'base_goerli',
} as const

export function isSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>,
): chainId is SupportedChainsType {
  if (featureFlags && chainId && chainId in featureFlags) {
    return featureFlags[chainId]
  }
  return !!chainId && SUPPORTED_CHAINS.indexOf(chainId) !== -1
}

export function asSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>,
): SupportedChainsType | undefined {
  if (!chainId) return undefined
  if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
    return undefined
  }
  return isSupportedChain(chainId) ? chainId : undefined
}

export const TESTNET_CHAIN_IDS = [ChainId.BASE_GOERLI] as const

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [ChainId.BASE, ChainId.BASE_GOERLI] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

/**
 * Supported networks for V2 pool behavior.
 */
export const SUPPORTED_V2POOL_CHAIN_IDS = [ChainId.BASE, ChainId.BASE_GOERLI] as const
