interface LoadingInfo {
  isLoading: boolean
}

export interface VestingInfo {
  arxAmount: string
  xArxAmount: string
  endTime: string
  redeemIndex: number
  canFinalize: boolean
}

export interface UserXTokenVestingInfo {
  redemptionCount: number
  vestingList: VestingInfo[]
}

export interface UserXTokenInfo extends LoadingInfo {
  protocolTokenBalance: string
  xTokenBalance: string
  xTokenReedeemingBalance: string
  xTokenTotalBalance: string
}

export interface XTokenState {
  userInfo: UserXTokenInfo
  redemptionInfo: UserXTokenVestingInfo
}
