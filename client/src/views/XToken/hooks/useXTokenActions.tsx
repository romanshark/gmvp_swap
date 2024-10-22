import { TransactionResponse } from '@ethersproject/abstract-provider'
import { parseUnits } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import useCatchTxError from 'hooks/useCatchTxError'
import { useXToken } from 'hooks/useContract'
import { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserXTokenDataAsync } from 'state/xToken'

const useXTokenActions = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account, chainId } = useWeb3React()
  const xToken = useXToken()
  const { fetchWithCatchTxError } = useCatchTxError()
  const dispatch = useAppDispatch()

  const fetchUserData = useCallback(() => {
    if (account) {
      dispatch(fetchUserXTokenDataAsync({ account, chainId }))
    }
  }, [dispatch, account, chainId])

  // Wrap all of the common/repeated ops in one function
  const runAction = useCallback(
    async (action: Promise<TransactionResponse>) => {
      setPendingTx(true)
      const receipt = await fetchWithCatchTxError(() => action)
      fetchUserData()
      setPendingTx(false)

      return receipt
    },
    [fetchUserData, fetchWithCatchTxError],
  )

  const convertToXToken = useCallback(
    async (amount: string) => {
      return runAction(xToken.convert(parseUnits(amount)))
    },
    [xToken, runAction],
  )

  const cancelVesting = useCallback(
    async (redeemIndex: number) => {
      return runAction(xToken.cancelRedeem(redeemIndex))
    },
    [xToken, runAction],
  )

  const finalizeVesting = useCallback(
    async (redeemIndex: number) => {
      return runAction(xToken.finalizeRedeem(redeemIndex))
    },
    [xToken, runAction],
  )

  const doXTokenRedemption = useCallback(
    async (amount: string, duration: number) => {
      return runAction(xToken.redeem(parseUnits(amount), duration))
    },
    [xToken, runAction],
  )

  return { convertToXToken, cancelVesting, finalizeVesting, fetchUserData, doXTokenRedemption, pendingTx }
}

export default useXTokenActions
