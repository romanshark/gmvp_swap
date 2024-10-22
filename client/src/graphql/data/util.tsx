import { ChainId } from '@baseswapfi/sdk-core'

// Believe this has to do with their personal backend API setup

const GQL_CHAINS: number[] = []
type GqlChainsType = typeof GQL_CHAINS[number]

export function isGqlSupportedChain(chainId: number | undefined): chainId is GqlChainsType {
  return !!chainId && GQL_CHAINS.includes(chainId)
}
