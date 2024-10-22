import { parseUnits } from '@ethersproject/units'
import { useNftPool } from 'hooks/useContract'
import { useCallback } from 'react'

const useWithdrawNftPoolPosition = (nftPoolAddress: string) => {
  let nftPool

  if (nftPoolAddress) {
    nftPool = useNftPool(nftPoolAddress)
  }

  const withdrawNftPoolPosition = useCallback(
    async (tokenId: number, amount: string) => {
      try {
        return nftPool.withdrawFromPosition(tokenId, parseUnits(amount))
      } catch (err) {
        console.log(err)
      }
    },
    [nftPoolAddress, nftPool],
  )

  return { withdrawNftPoolPosition }
}

export default useWithdrawNftPoolPosition
