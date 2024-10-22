import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect } from 'react'
import { useAppDispatch } from 'state'
import { fetchNftPoolAllowancesAsync, fetchNftPoolFarmDataAsync, fetchNftPositionsAsync } from 'state/xFarms'
import { useNftPoolsInfo, useNftPositions } from 'state/xFarms/hooks'

const useNftPools = () => {
  const { account, chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { poolAllowances } = useNftPoolsInfo()
  const positions = useNftPositions()

  const fetchAllowances = useCallback(
    () => dispatch(fetchNftPoolAllowancesAsync({ account, chainId })),
    [dispatch, account, chainId],
  )
  const fetchUserPoolsData = useCallback(
    () => dispatch(fetchNftPositionsAsync({ account, chainId })),
    [dispatch, account, chainId],
  )

  const getInitialPoolPosition = useCallback(
    (nftPoolAddress: string) => {
      return positions.find((p) => p.nftPoolAddress === nftPoolAddress)
    },
    [positions],
  )

  const fetchXFarmData = useCallback(() => dispatch(fetchNftPoolFarmDataAsync({ chainId })), [dispatch])

  const fetchUserXFarmData = useCallback(() => {
    if (account) {
      fetchAllowances()
      fetchUserPoolsData()
    }
  }, [fetchAllowances, fetchUserPoolsData, account])

  const fetchAllData = useCallback(() => {
    fetchUserXFarmData()
    fetchXFarmData()
  }, [fetchUserXFarmData, fetchXFarmData])

  useEffect(() => {
    if (account) {
      fetchUserXFarmData()
    }
  }, [account, chainId])

  return {
    fetchUserPoolsData,
    fetchAllowances,
    getInitialPoolPosition,
    fetchUserXFarmData,
    fetchXFarmData,
    fetchAllData,
    poolAllowances,
  }
}

export default useNftPools
