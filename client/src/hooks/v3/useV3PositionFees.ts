import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount } from '@baseswapfi/sdk-core'
import { Pool } from '@baseswapfi/v3-sdk2'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useEffect, useState } from 'react'
import { unwrappedToken } from 'utils/v3/unwrappedToken'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useV3NFTPositionManagerContract } from '../useContract'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: BigNumber,
  asWETH = false,
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
  const { chainId } = useActiveWeb3React()
  const positionManager = useV3NFTPositionManagerContract(chainId, false)
  const owner: string | undefined = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId])
    .result?.[0]

  const tokenIdHexString = tokenId?.toHexString()
  const latestBlockNumber = useBlockNumber()

  // we can't use multicall for this because we need to simulate the call from a specific address
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[BigNumber, BigNumber] | undefined>()
  useEffect(() => {
    ;(async function getFees() {
      if (positionManager && tokenIdHexString && owner) {
        try {
          const results = await positionManager.callStatic.collect(
            {
              tokenId: tokenIdHexString,
              recipient: owner, // some tokens might fail if transferred to address(0)
              amount0Max: MAX_UINT128,
              amount1Max: MAX_UINT128,
            },
            { from: owner }, // need to simulate the call as the owner
          )
          setAmounts([results.amount0, results.amount1])
        } catch (error) {
          // If the static call fails, the default state will remain for `amounts`.
          // This case is handled by returning unclaimed fees as empty.
          // TODO(WEB-2283): Look into why we have failures with call data being 0x.
          console.log(error)
        }
      }
    })()
  }, [positionManager, tokenIdHexString, owner, latestBlockNumber])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(asWETH ? pool.token0 : unwrappedToken(pool.token0), amounts[0].toString()),
      CurrencyAmount.fromRawAmount(asWETH ? pool.token1 : unwrappedToken(pool.token1), amounts[1].toString()),
    ]
  } else {
    return [undefined, undefined]
  }
}
