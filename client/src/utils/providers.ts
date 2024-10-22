import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@magikswap/sdk'
import { baseChain, baseGoerli } from '../../packages/wagmi/src/chains'

const providers: { [chainId in ChainId]?: StaticJsonRpcProvider | null } = {
  [ChainId.BASE]: null,
  [ChainId.BASE_GOERLI]: null,
}

const RPC = {
  [ChainId.BASE]: baseChain.rpcUrls.default,
  [ChainId.BASE_GOERLI]: baseGoerli.rpcUrls.default,
}

export function getChainRpcURL(chainId: ChainId) {
  return RPC[chainId]
}

export function getChainRpcProvider(chainId: ChainId) {
  // Avoid any weird memory leak issues
  if (providers[chainId]) return providers[chainId]

  const rpcProvider = new StaticJsonRpcProvider(getChainRpcURL(chainId))
  providers[chainId] = rpcProvider

  return providers[chainId]
}

export const DEFAULT_CHAIN_ID = ChainId.BASE

export const defaultRpcProvider = getChainRpcProvider(DEFAULT_CHAIN_ID)

export default null
