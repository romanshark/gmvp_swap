import { Currency, CurrencyAmount } from '@baseswapfi/sdk-core'
import { ApprovalState, useApproval } from 'lib/hooks/useApproval'
import { useCallback } from 'react'

import { useHasPendingApproval } from 'state/transactions/v3/hooks'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import { TransactionType } from 'state/transactions/types'

function useGetAndTrackApproval(getApproval: ReturnType<typeof useApproval>[1]) {
  const addTransaction = useTransactionAdder()

  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        const { response, tokenAddress, spenderAddress: spender, amount } = pending
        addTransaction(response, {
          type: TransactionType.APPROVAL,
          tokenAddress,
          spender,
          amount: amount.quotient.toString(),
        })
      }
    })
  }, [addTransaction, getApproval])
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApproval(amountToApprove, spender, useHasPendingApproval)
  return [approval, useGetAndTrackApproval(getApproval)]
}
