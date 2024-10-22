import { parseUnits } from '@ethersproject/units'
import { useNftPool } from 'hooks/useContract'
import { useCallback } from 'react'

const useAddToNftPoolPosition = (nftPoolAddress: string) => {
  const nftPool = useNftPool(nftPoolAddress)

  const addToNftPoolPosition = useCallback(
    async (tokenId: number, amountToAdd: string) => {
      if (nftPool) {
        try {
          return nftPool.addToPosition(tokenId, parseUnits(amountToAdd))
        } catch (err) {
          console.log(err)
        }
      }
    },
    [nftPool],
  )

  return { addToNftPoolPosition }
}

export default useAddToNftPoolPosition
