import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserXTokenVestingInfo, XTokenState } from './types'
import { fetchUserXTokenInfo, fetchUserXTokenRedeemsInfo } from './fetchXTokenInfo'

const initialState: XTokenState = {
  userInfo: {
    isLoading: true,
    protocolTokenBalance: '0',
    xTokenBalance: '0',
    xTokenTotalBalance: '0',
    xTokenReedeemingBalance: '0',
  },
  redemptionInfo: {
    redemptionCount: 0,
    vestingList: [],
  },
}

export const fetchUserXTokenDataAsync = createAsyncThunk<XTokenState, { account: string; chainId: number }>(
  'xToken/fetchUserXTokenDataAsync',
  async ({ account, chainId }) => {
    if (!account) {
      return initialState
    }

    const [userInfo, redemptionInfo] = await Promise.all([
      fetchUserXTokenInfo(account, chainId),
      fetchUserXTokenRedeemsInfo(account, chainId),
    ])

    return {
      userInfo,
      redemptionInfo,
    }
  },
)

export const fetchUserXTokenRedeemsInfoAsync = createAsyncThunk<
  UserXTokenVestingInfo,
  { account: string; chainId: number }
>('xToken/fetchUserXTokenRedeemsInfoAsync', async ({ account, chainId }) => {
  // current redeeming info for user
  return fetchUserXTokenRedeemsInfo(account, chainId)
})

export const xTokenSlice = createSlice({
  name: 'xToken',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserXTokenDataAsync.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })

    builder.addCase(fetchUserXTokenDataAsync.rejected, (state, action) => {
      // console.log(action.error)
      return state
    })

    builder.addCase(fetchUserXTokenRedeemsInfoAsync.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })

    builder.addCase(fetchUserXTokenRedeemsInfoAsync.rejected, (state, action) => {
      // console.log(action.error)
      return state
    })
  },
})

export default xTokenSlice.reducer
