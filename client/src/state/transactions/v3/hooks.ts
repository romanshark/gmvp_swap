import { useMemo, useCallback } from 'react'
import { isTransactionRecent, useAllTransactions } from '../hooks'
import { Token } from '@baseswapfi/sdk-core'
import { BigNumber } from '@ethersproject/bignumber'
import { addTransaction } from '../actions'
import { TransactionDetails, TransactionInfo, TransactionType } from '../types'
import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  info: TransactionInfo,
  deadline?: number,
) => void {
  const { chainId, account } = useWeb3React()
  const dispatch = useAppDispatch()

  return useCallback(
    (response: TransactionResponse, info: TransactionInfo, deadline?: number) => {
      if (!account) return
      if (!chainId) return

      const { hash, nonce } = response
      if (!hash) {
        throw Error('No transaction hash found.')
      }
      dispatch(addTransaction({ hash, from: account, info, chainId, nonce, deadline }))
    },
    [account, chainId, dispatch],
  )
}

function usePendingApprovalAmount(token?: Token, spender?: string): BigNumber | undefined {
  const allTransactions = useAllTransactions()
  return useMemo(() => {
    if (typeof token?.address !== 'string' || typeof spender !== 'string') {
      return undefined
    }
    for (const txHash in allTransactions) {
      const tx = allTransactions[txHash]
      if (!tx || tx.receipt || tx.info?.type !== TransactionType.APPROVAL) continue
      if (tx.info.spender === spender && tx.info.tokenAddress === token.address && isTransactionRecent(tx)) {
        return BigNumber.from(tx.info.amount)
      }
    }
    return undefined
  }, [allTransactions, spender, token?.address])
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(token?: Token, spender?: string): boolean {
  return usePendingApprovalAmount(token, spender)?.gt(0) ?? false
}
