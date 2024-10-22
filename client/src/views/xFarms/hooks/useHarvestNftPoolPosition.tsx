import { useWeb3React } from '@web3-react/core'
import useCatchTxError from 'hooks/useCatchTxError'
import { useNftPool } from 'hooks/useContract'
import { useCallback } from 'react'
import useNftPools from './useNftPools'

export const useHarvestPosition = (nftPoolAddress: string) => {
  const { account } = useWeb3React()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { fetchUserXFarmData } = useNftPools()
  const nftPool = useNftPool(nftPoolAddress)

  const harvestPositionTo = useCallback(
    async (tokenId: number) => {
      const receipt = await fetchWithCatchTxError(() => {
        return nftPool.harvestPositionTo(tokenId, account)
      })

      fetchUserXFarmData()

      return receipt
    },
    [nftPoolAddress, nftPool, account, fetchWithCatchTxError],
  )

  const harvestPosition = useCallback(
    async (tokenId: number) => {
      const receipt = await fetchWithCatchTxError(() => {
        return nftPool.harvestPosition(tokenId)
      })

      fetchUserXFarmData()

      return receipt
    },
    [nftPoolAddress, nftPool, fetchWithCatchTxError],
  )

  return { harvestPositionTo, harvestPosition }
}
