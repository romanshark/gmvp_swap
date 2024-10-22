export interface IPositionInfo {
  nftPoolAddress: string
  nitroPoolAddress?: string
  nftBalance: number
  stakedBalance: string
  tokenIds: number[]
  userLpBalance: string
  pendingRewards: IPositionReward[]

  nitroUserInfo?: IUserNitroPoolInfo
  hasNitroDeposit: boolean
}

export interface IUserNitroPoolInfo {
  //  nitroPoolAddress: string
  spNftDepositCount: number // User NFTPool balance changes with deposits/transfers to and from nitro pools
  pendingNitroRewards: IPositionReward[]
}

export interface IPositionReward {
  token: string
  pendingReward: number
}

export interface IDefiEdgeStrategyInfo {
  strategy: IDefiEdgeStrategy
}

export interface IDefiEdgeStrategy {
  address: string // strategy address
  aum: number // Assets Under Management
  network: string
  sharePrice: number
  title: string
}

export interface IQuantumFarmData {
  address: string // LP address
  sharePrice: number
  farmId: number
  token0Price: number
  token1Price: number
  totalSupply: number
}

export interface IStakingPosition {
  nftPoolAddress: string
  tokenId: number
  amount: string
  amountWithMultiplier?: string
  boostPoints?: string
  lockDuration?: string
  lockMultiplier?: string
  startLockTime?: string
  totalMultiplier?: string
}

export interface NftPool {
  nftPoolAddress: string
  oldChefPoolId: number
  balance: number // user NFT balance
  userLpBalance: string // wallet balance
  lpSupply: string
  lpSymbol: string
  tokenIds: number[]
  nftPositions: NFTPoolPosition[] // user attached positions
}

export interface NFTPoolPosition {
  nftPoolAddress: string
  tokenId: number
  amount: string
  pendingRewards: RewardToken[]
}

export interface RewardToken {
  token: string
  pendingReward: number
}

export interface UserNFTPoolInfo {
  poolAddress: string
  balance: number // NFT balance
  userLpData: UserNftPoolLpData
}

export interface UserNftPoolLpData {
  tokenBalance: string // in wallet
  stakedBalance: string
}

export interface NFTPoolAllowance {
  poolAddress: string
  hasLpApproval: boolean
}

// From ChefRamsey
export interface NftPoolInfo {
  poolAddress: string
  allocPointsARX: string
  allocPointsWETH: string
  poolEmissionRate: string
  poolEmissionRateWETH: string
  lpSupply: string
}

export interface NftPoolFarmData {
  arxPerSec: number
  WETHPerSec: number
  poolLength: number
  userDataLoaded: boolean
  farms: any[]
  totalTVL?: number
}

export interface NftPoolsState {
  nftPools: NftPool[]
  poolAllowances: NFTPoolAllowance[]
  farmsData: NftPoolFarmData
  nftPositions: IPositionInfo[]
}
