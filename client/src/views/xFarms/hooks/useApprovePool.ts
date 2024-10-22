import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Address } from 'config/constants/types'

const useApprovePool = (lpContract: Contract, nftPoolAddress: string | Address) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [nftPoolAddress, MaxUint256])
  }, [lpContract, nftPoolAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApprovePool
