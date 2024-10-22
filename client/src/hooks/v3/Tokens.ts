import { ChainId, Currency, Token } from '@baseswapfi/sdk-core'
import { getChainInfo } from 'config/constants/chainInfo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyFromMap, useTokenFromMapOrNetwork } from 'lib/hooks/useCurrency'
import { useMemo } from 'react'
import { useAllLists, useCombinedActiveList, useUnsupportedTokenList } from 'state/lists/hooks'
import { TokenAddressMap } from 'state/types'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'

type Maybe<T> = T | null | undefined

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, chainId: Maybe<ChainId>): { [address: string]: Token } {
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    return Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})
  }, [chainId, tokenMap])
}

/** Returns all tokens from the default list + user added tokens */
export function useDefaultActiveTokens(chainId: Maybe<ChainId>): { [address: string]: Token } {
  const defaultListTokens = useCombinedActiveList()
  const tokensFromMap = useTokensFromMap(defaultListTokens, chainId)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...tokensFromMap },
        )
    )
  }, [tokensFromMap, userAddedTokens])
}

export function useCurrency(currencyId: Maybe<string>, chainId?: ChainId): Currency | null | undefined {
  const { chainId: connectedChainId } = useActiveWeb3React()
  const tokens = useDefaultActiveTokens(chainId ?? connectedChainId)
  return useCurrencyFromMap(tokens, chainId ?? connectedChainId, currencyId)
}

type BridgeInfo = Record<
  ChainId,
  {
    tokenAddress: string
    originBridgeAddress: string
    destBridgeAddress: string
  }
>

export function useUnsupportedTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const listsByUrl = useAllLists()
  const unsupportedTokensMap = useUnsupportedTokenList()
  const unsupportedTokens = useTokensFromMap(unsupportedTokensMap, chainId)

  // // checks the default L2 lists to see if `bridgeInfo` has an L1 address value that is unsupported
  // const l2InferredBlockedTokens: typeof unsupportedTokens = useMemo(() => {
  //   if (!chainId) {
  //     return {}
  //   }

  //   if (!listsByUrl) {
  //     return {}
  //   }

  //   const listUrl = getChainInfo(chainId).defaultListUrl

  //   const { current: list } = listsByUrl[listUrl]
  //   if (!list) {
  //     return {}
  //   }

  //   // const unsupportedSet = new Set(Object.keys(unsupportedTokens))

  //   return list.tokens.reduce((acc, tokenInfo) => {
  //     // const bridgeInfo = tokenInfo.extensions?.bridgeInfo as unknown as BridgeInfo
  //     // if (
  //     //   bridgeInfo &&
  //     //   bridgeInfo[ChainId.MAINNET] &&
  //     //   bridgeInfo[ChainId.MAINNET].tokenAddress &&
  //     //   unsupportedSet.has(bridgeInfo[ChainId.MAINNET].tokenAddress)
  //     // ) {
  //     //   const address = bridgeInfo[ChainId.MAINNET].tokenAddress
  //     //   // don't rely on decimals--it's possible that a token could be bridged w/ different decimals on the L2
  //     //   return { ...acc, [address]: new Token(ChainId.MAINNET, address, tokenInfo.decimals) }
  //     // }

  //     return acc
  //   }, {})
  // }, [chainId, listsByUrl, unsupportedTokens])

  return { ...unsupportedTokens }
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(tokenAddress?: string | null): Token | null | undefined {
  const { chainId } = useActiveWeb3React()
  const tokens = useDefaultActiveTokens(chainId)
  return useTokenFromMapOrNetwork(tokens, tokenAddress)
}
