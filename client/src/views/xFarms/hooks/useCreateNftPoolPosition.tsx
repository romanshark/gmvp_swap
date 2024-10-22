import { parseUnits } from '@ethersproject/units'
import { useNftPool } from 'hooks/useContract'
import { useCallback } from 'react'

const useCreateNftPoolPosition = (nftPoolAddress: string) => {
  const nftPool = useNftPool(nftPoolAddress)

  const createNftPoolPosition = useCallback(
    async (amount: string, lockDurationSeconds = 0) => {
      if (nftPool) {
        try {
          return nftPool.createPosition(parseUnits(amount), lockDurationSeconds)
        } catch (err) {
          console.log(err)
        }
      }
    },
    [nftPoolAddress, nftPool],
  )

  return { createNftPoolPosition }
}

export default useCreateNftPoolPosition
