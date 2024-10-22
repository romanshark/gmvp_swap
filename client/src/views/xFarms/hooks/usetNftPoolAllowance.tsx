import { Address } from 'config/constants/types'
import { getAddress } from '@ethersproject/address'
import { useERC20 } from 'hooks/useContract'
import { useNftPoolsInfo } from 'state/xFarms/hooks'
import useApprovePool from './useApprovePool'
import useCatchTxError from 'hooks/useCatchTxError'
import useToast from 'hooks/useToast'
import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useAppDispatch } from 'state'
import { fetchNftPoolAllowancesAsync } from 'state/xFarms'
import { useTranslation } from '@pancakeswap/localization'

export const useNftPoolAllowance = (nftPoolAddress: string | Address, lpAddress: string) => {
  const { account, chainId } = useWeb3React()
  const { poolAllowances } = useNftPoolsInfo()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const dispatch = useAppDispatch()

  const lpContract = useERC20(getAddress(lpAddress))
  const { onApprove } = useApprovePool(lpContract, nftPoolAddress)

  const doApproval = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })

    if (receipt?.status) {
      toastSuccess(t('CONTRACT ENABLED'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchNftPoolAllowancesAsync({ account, chainId }))
    }
  }, [onApprove, dispatch, account, nftPoolAddress, fetchWithCatchTxError, poolAllowances])

  return {
    hasApproval: poolAllowances.find((p) => p.poolAddress === nftPoolAddress)?.hasLpApproval || false,
    doApproval,
    pendingTx,
  }
}
