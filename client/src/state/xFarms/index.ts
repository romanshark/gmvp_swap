import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IPositionInfo, NFTPoolAllowance, NftPoolFarmData, NftPoolsState } from './types'
import { fetchNftPoolAllowances, fetchNftPositions } from './fetchUserFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'

export const defaultFarmsData: NftPoolFarmData = {
  poolLength: 0,
  userDataLoaded: false,
  farms: [],
  arxPerSec: 0,
  WETHPerSec: 0,
}

const initialState: NftPoolsState = {
  nftPools: [],
  poolAllowances: [],
  farmsData: defaultFarmsData,
  nftPositions: [],
}

export const fetchNftPoolAllowancesAsync = createAsyncThunk<NFTPoolAllowance[], { account: string; chainId: number }>(
  'nftPools/fetchNftPoolAllowancesAsync',
  async ({ account, chainId }) => {
    if (!account) {
      return []
    }

    return fetchNftPoolAllowances(account, chainId)
  },
)

export const fetchNftPositionsAsync = createAsyncThunk<IPositionInfo[], { account: string; chainId: number }>(
  'nftPools/fetchNftPositionsAsync',
  async ({ account, chainId }) => {
    if (!account) {
      return []
    }

    return fetchNftPositions(account, chainId)
  },
)

export const fetchNftPoolFarmDataAsync = createAsyncThunk<NftPoolFarmData, { chainId: number }>(
  'nftPools/fetchNftPoolFarmDataAsync',
  async ({ chainId }) => {
    if (!chainId) {
      return defaultFarmsData
    }

    return fetchMasterChefData(chainId)
  },
)

export const nftPoolsSlice = createSlice({
  name: 'nftPools',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNftPoolAllowancesAsync.fulfilled, (state, action) => {
      state.poolAllowances = action.payload
      return state
    })
    builder.addCase(fetchNftPoolAllowancesAsync.rejected, (state, action) => {
      console.log(action.error)
      return state
    })
    builder.addCase(fetchNftPositionsAsync.fulfilled, (state, action) => {
      state.nftPositions = action.payload
      return state
    })
    builder.addCase(fetchNftPositionsAsync.rejected, (state, action) => {
      console.log(action.error)
      return state
    })
    builder.addCase(fetchNftPoolFarmDataAsync.fulfilled, (state, action) => {
      state.farmsData = action.payload
      return state
    })
    builder.addCase(fetchNftPoolFarmDataAsync.rejected, (state, action) => {
      console.log(action.error)
      return state
    })
  },
})

export default nftPoolsSlice.reducer
