import { ChainId } from '@baseswapfi/sdk-core'
import { baseChain, baseGoerli } from '../../../packages/wagmi/src/chains'

/**
 * Fallback JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const FALLBACK_URLS = {
  [ChainId.BASE]: [
    // "Safe" URLs
    'https://mainnet.base.org',
    // "Unsafe" URLs
    baseChain.rpcUrls.default,
    'https://base-mainnet.blastapi.io/b5a802d8-151d-4443-90a7-699108dc4e01',
    'https://svc.blockdaemon.com/base/mainnet/native?apiKey=zpka_1334e7c450464d06b6e33a972a7a4e57_75320f43',
  ],
  [ChainId.BASE_GOERLI]: [
    // "Safe" URLs
    'https://goerli.base.org',
    // "Unsafe" URLs
    baseGoerli.rpcUrls.default,
    'https://base-goerli.blastapi.io/b5a802d8-151d-4443-90a7-699108dc4e01',
    'https://svc.blockdaemon.com/base/testnet/native?apiKey=zpka_1334e7c450464d06b6e33a972a7a4e57_75320f43',
  ],
}

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS = {
  [ChainId.BASE]: [baseChain.rpcUrls.default, ...FALLBACK_URLS[ChainId.BASE]],
  [ChainId.BASE_GOERLI]: [baseGoerli.rpcUrls.default, ...FALLBACK_URLS[ChainId.BASE_GOERLI]],
}
