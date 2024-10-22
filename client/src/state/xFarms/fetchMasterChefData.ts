import { getNftPoolAddresses, getNftPoolConfigs } from 'config/constants/farms'
import { getMasterchefContract } from 'utils/contractHelpers'
import multicall, { Call, multicallv2 } from 'utils/multicall'
import ramseyAbi from '../../config/abi/ChefRamsey.json'
import nftPoolAbi from '../../config/abi/NFTPool.json'
import { getAddress, getChefRamseyAddress } from 'utils/addressHelpers'
import { SerializedFarm } from 'state/types'
import { SerializedFarmConfig } from 'config/constants/types'
import erc20 from 'config/abi/erc20.json'
import chunk from 'lodash/chunk'
import { NftPoolFarmData } from './types'
import BigNumber from 'bignumber.js'
import getFarmsPrices from 'state/farms/getFarmsPrices'
import { getCombinedTokenPrices } from 'utils/tokenPricing'
import { BIG_TWO, ethersToBigNumber } from 'utils/bigNumber'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { defaultFarmsData } from '.'
import { formatUnits } from '@ethersproject/units'
import { getLpPrice } from 'state/farms/selectors'

const dummyPoolId = 16
const ramseyAddress = getChefRamseyAddress()

export const fetchFarmsLpTokenData = async (farms: SerializedFarmConfig[], chainId): Promise<any[]> => {
  const fetchFarmCalls = (farm: SerializedFarm) => {
    const { lpAddresses, token, quoteToken } = farm
    const lpAddress = getAddress(lpAddresses)

    return [
      // Balance of token in the LP contract
      {
        address: token.address,
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of quote token on LP contract
      {
        address: quoteToken.address,
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of LP tokens in the pool contract
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [farm.nftPoolAddress[chainId]],
      },
      // Total supply of LP tokens
      {
        address: lpAddress,
        name: 'totalSupply',
      },
      // Token decimals
      {
        address: token.address,
        name: 'decimals',
      },
      // Quote token decimals
      {
        address: quoteToken.address,
        name: 'decimals',
      },
    ]
  }

  try {
    const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
    const chunkSize = farmCalls.length / farms.length
    const farmMultiCallResult = await multicallv2(erc20, farmCalls)
    return chunk(farmMultiCallResult, chunkSize)
  } catch (error) {
    console.log('ERRORRRRRRRRRR', error)
  }

  return []
}

const getCurrentChefData = async () => {
  const calls: Call[] = [
    {
      address: ramseyAddress,
      name: 'poolsLength',
    },

    {
      address: ramseyAddress,
      name: 'totalAllocPoints',
    },

    {
      address: ramseyAddress,
      name: 'totalAllocPointsWETH',
    },

    {
      address: ramseyAddress,
      name: 'emissionRates',
    },
  ]

  const [[poolsLength], [totalAllocPointsARX], [totalAllocPointsWETH], emissionRates] = await multicall(
    ramseyAbi,
    calls,
  )

  const ogChef = getMasterchefContract()
  const dummyPoolInfo = await ogChef.poolInfo(dummyPoolId)
  const dummyPoolAllocPointsWETH = dummyPoolInfo.allocPoint.toNumber()

  const chefData = {
    poolLength: poolsLength.toNumber(),
    chefTotalAllocPoints: totalAllocPointsARX.toNumber(),
    chefTotalAllocPointsWETH: totalAllocPointsWETH.toNumber(),
    emissionRates: {
      mainRate: ethersToBigNumber(emissionRates.mainRate).div(1e18).toNumber(),
      wethRate: ethersToBigNumber(emissionRates.wethRate).div(1e18).toNumber(),
    },
    dummyPoolAllocPointsWETH,
  }

  return chefData
}

const getCombinedNftPoolInfos = async (chainId: number) => {
  const nftPoolAddresses = getNftPoolAddresses(chainId)

  const nftPoolInfoCalls: Call[] = []
  const chefPoolInfoCalls: Call[] = []

  nftPoolAddresses.forEach((address) => {
    nftPoolInfoCalls.push({
      address,
      name: 'getPoolInfo',
      params: [],
    })

    chefPoolInfoCalls.push({
      address: ramseyAddress,
      name: 'getPoolInfo',
      params: [address],
    })
  })

  const [poolInfos, chefInfos] = await Promise.all([
    multicall(nftPoolAbi, nftPoolInfoCalls),
    multicall(ramseyAbi, chefPoolInfoCalls),
  ])

  return poolInfos.map((info, idx) => {
    return {
      ...info,
      ...chefInfos[idx],
      lpSupply: ethersToBigNumber(info.lpSupply),
    }
  })
}

export const fetchMasterChefData = async (chainId: number): Promise<NftPoolFarmData> => {
  try {
    // console.time('[fetchMasterChefData]')

    const farms = await fetchXFarmsData(chainId)
    // Need native farm added in
    const farmsWithPrices = (await getFarmsPrices(farms.farms)).map((f) => {
      const lpPrice = getLpPrice(f).div(1e18).toString()
      return {
        ...f,
        lpPrice,
      }
    })

    return {
      ...farms,
      farms: farmsWithPrices,
    }
  } catch (error) {
    console.log(error)
    return defaultFarmsData
  }
}

const fetchXFarmsData = async (chainId: number): Promise<NftPoolFarmData> => {
  const farmConfigs = getNftPoolConfigs(chainId)

  // need to add native/stable farm into this without calling nft stuff on it

  const [chefInfo, farmResult, nftPoolInfos, tokenPrices] = await Promise.all([
    getCurrentChefData(),
    fetchFarmsLpTokenData(farmConfigs, chainId),
    getCombinedNftPoolInfos(chainId),
    getCombinedTokenPrices(chainId),
  ])

  const { prices } = tokenPrices

  const { poolLength, emissionRates, chefTotalAllocPoints, chefTotalAllocPointsWETH, dummyPoolAllocPointsWETH } =
    chefInfo

  const arxPerSec = emissionRates.mainRate
  const WETHPerSec = emissionRates.wethRate
  let TVL = 0
  // console.log(prices)

  const farmsData = nftPoolInfos.map((pool, idx) => {
    const configMatch = farmConfigs.find(
      (p) => p.nftPoolAddress[chainId].toLowerCase() === pool.poolAddress.toLowerCase(),
    )

    const nftPoolAddress = configMatch.nftPoolAddress[chainId]
    // const nitroPoolAddress = configMatch.nitroPoolAddressMap ? configMatch.nitroPoolAddressMap[chainId] : null
    // const stratAddress = configMatch.lpAddresses[chainId]
    const farm: any = configMatch

    const [
      mainTokenBalanceInLP,
      quoteTokenBalanceInLP,
      lpTokenBalancePool,
      lpTotalSupply,
      [tokenDecimals],
      [quoteTokenDecimals],
    ] = farmResult[idx]

    const lpTokensPool = ethersToBigNumber(lpTokenBalancePool.balance).div(1e18)
    const lpAmountInPool = pool.lpSupply

    const lpTotalSupplyBN = new BigNumber(lpTotalSupply).div(1e18)
    // Ratio in % of LP tokens that are staked in the pool, vs the total number in circulation
    const lpTokenRatio = lpTokensPool.div(lpTotalSupplyBN)

    // Raw amount of each token in the LP, including those not staked
    const mainAmountInLpTotal = new BigNumber(mainTokenBalanceInLP).div(getFullDecimalMultiplier(tokenDecimals))
    const quoteTokenAmountInLpTotal = new BigNumber(quoteTokenBalanceInLP).div(
      getFullDecimalMultiplier(quoteTokenDecimals),
    )

    // So now the allocPointARX is the BSX, and BSWAP is the WETH
    // So the logic here does not really apply except for the WETH part

    // Amount of quoteToken in the LP that are staked in the pool
    const mainTokenAmountInPool = mainAmountInLpTotal.times(lpTokenRatio)
    const quoteTokenAmountInPool = quoteTokenAmountInLpTotal.times(lpTokenRatio)

    const lpTotalInQuoteToken = farm.quantum
      ? lpAmountInPool.div(getFullDecimalMultiplier(18))
      : quoteTokenAmountInPool.times(BIG_TWO)

    const poolsAllocPoints = new BigNumber(pool.allocPoints.toNumber())
    const poolsAllocPointsWETH = new BigNumber(pool.allocPointsWETH.toNumber())

    const dummyPoolTotalWETHAllocBN = new BigNumber(dummyPoolAllocPointsWETH)

    const poolsPercentOfAllocWETH = poolsAllocPointsWETH.toNumber() / chefTotalAllocPointsWETH
    const poolsPercentOfAllocationWethBN = new BigNumber(poolsPercentOfAllocWETH)

    const arxPoolWeight = poolsAllocPoints.toNumber() / chefTotalAllocPoints

    const poolAdjustedsWETHAllocPoint = poolsPercentOfAllocationWethBN.times(dummyPoolTotalWETHAllocBN)
    const poolsAdjustedWETHPoolWeight = poolAdjustedsWETHAllocPoint.div(dummyPoolTotalWETHAllocBN)

    farm.lpTotalInQuoteToken = lpTotalInQuoteToken.toString()

    const mainTokenPrice = prices[farm.token.address.toString().toLowerCase()]
    const quoteTokenPrice = prices[farm.quoteToken.address.toString().toLowerCase()]

    if (farm.classic) {
      if (mainTokenPrice && quoteTokenPrice) {
        const poolMainValue = mainTokenAmountInPool.times(new BigNumber(mainTokenPrice)).toNumber()
        const poolQuoteValue = quoteTokenAmountInPool.times(new BigNumber(quoteTokenPrice)).toNumber()
        const tvl = poolMainValue + poolQuoteValue
        TVL += tvl
        farm.TVL = tvl
      } else {
        console.log('Classic farm is missing prices')
        console.log(`pid: ${configMatch.pid}`)
        farm.TVL = 0
      }
    } else if (farm.quantum) {
      // if (farmStrat) {
      //   const totalLiquidity = lpTotalInQuoteToken.times(farmStrat.sharePrice)
      //   const tvl = totalLiquidity.toNumber()
      //   farm.TVL = tvl
      //   TVL += tvl
      // } else {
      //   farm.TVL = 0s
      // }
    } else {
      farm.TVL = 0
    }

    const result = {
      nftPoolAddress,
      // nitroPoolAddress,
      ...configMatch,
      ...farm,
      ...pool,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal: mainAmountInLpTotal.toJSON(),
      quoteTokenAmountTotal: quoteTokenAmountInLpTotal.toJSON(),
      quoteTokenAmountInPool,
      lpTotalSupply: lpTotalSupplyBN.toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmountInLpTotal.div(mainAmountInLpTotal).toJSON(),
      arxPoolWeight,
      WETHPoolWeight: poolsAdjustedWETHPoolWeight.toJSON(),
      multiplier: `${poolsAllocPoints.plus(poolAdjustedsWETHAllocPoint).div(100).toString()}X`,
      arxMultiplier: `${poolsAllocPoints.div(100).toString()}X`,
      WETHMultiplier: `${poolAdjustedsWETHAllocPoint.div(100).toString()}X`,
      quantumStrategy: farm.quantumStrategy || null,
      quantumStrategies: farm.quantumStrategies || null,
      lpAmountInPool,
      liquidity: farm.TVL,
      // sharePrice: farmStrat?.sharePrice,
      sharePrice: 0,
    }

    Object.entries(result).forEach((res) => {
      const prop = res[0]
      if (result[prop]?._isBigNumber) result[prop] = result[prop].toString()
    })

    return result
  })

  return {
    poolLength,
    arxPerSec,
    WETHPerSec,
    userDataLoaded: true,
    farms: farmsData,
    totalTVL: TVL,
  }
}
