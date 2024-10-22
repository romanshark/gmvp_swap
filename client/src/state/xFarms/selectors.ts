import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'

export const selectNftPoolsInfo = (state: State) => state.nftPools
export const nftPoolsInfoSelector = createSelector([selectNftPoolsInfo], (info) => {
  return info
})

export const selectNftPoolFarms = (state: State) => state.nftPools.farmsData
export const nftPoolsFarmsSelector = createSelector([selectNftPoolFarms], (info) => {
  return info
})

export const selectNftPositions = (state: State) => state.nftPools.nftPositions
export const nftPositionsSelector = createSelector([selectNftPositions], (info) => {
  return info
})
