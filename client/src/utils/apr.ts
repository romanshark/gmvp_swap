import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, SECONDS_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked > 0 ? totalStaked : 1)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularCakePerBlock: number,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularCakePerBlock)
    : new BigNumber(NaN)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

export const getXFarmApr = (
  arxPoolWeight: BigNumber,
  WETHPoolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  WETHPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  arxPerSec: number,
  WETHPerSec: number,
): { cakeRewardsApr: number } => {
  const yearlyCakeRewardAllocation = arxPoolWeight
    ? arxPoolWeight.times(SECONDS_PER_YEAR * arxPerSec)
    : new BigNumber(NaN)

  const yearlyWETHRewardAllocation = WETHPoolWeight
    ? WETHPoolWeight.times(SECONDS_PER_YEAR * WETHPerSec)
    : new BigNumber(NaN)

  const cakeRewardsApr = 
  yearlyCakeRewardAllocation
    .times(cakePriceUsd)
    .plus
    (yearlyWETHRewardAllocation.times(WETHPriceUsd))
    .div(poolLiquidityUsd)
    .times(100)

  let cakeRewardsAprAsNumber = null

  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }

  return { cakeRewardsApr: cakeRewardsAprAsNumber }
}

export default null
