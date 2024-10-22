import { useSelector } from 'react-redux'
import { IPositionInfo, NftPoolFarmData, NftPoolsState } from './types'
import { nftPoolsFarmsSelector, nftPoolsInfoSelector, nftPositionsSelector } from './selectors'

export const useNftPoolsInfo = (): NftPoolsState => {
  return useSelector(nftPoolsInfoSelector)
}

export const useNftPoolsFarms = (): NftPoolFarmData => {
  return useSelector(nftPoolsFarmsSelector)
}

export const useNftPositions = (): IPositionInfo[] => {
  return useSelector(nftPositionsSelector)
}
