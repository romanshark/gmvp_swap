import multicall, { Call } from 'utils/multicall'
import nftPoolAbi from '../../config/abi/NFTPool.json'
import { getNftPoolConfigs } from 'config/constants/farms'
import { IPositionInfo, NFTPoolAllowance, UserNFTPoolInfo, UserNftPoolLpData } from './types'
import { formatEthersToFloat } from 'utils/bigNumber'
import { ERC20_ABI } from 'config/abi/erc20'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { defaultRpcProvider } from 'utils/providers'
import { getTokenAddress } from 'config/constants/token-info'

const defaultUserLpData: UserNftPoolLpData = {
  tokenBalance: '0',
  stakedBalance: '0',
}

export const getUserNitroDepositBalances = async (account: string, positions: IPositionInfo[]) => {
  try {
    const calls: Call[] = []
    const poolIndexes = []
    let resultIndex = 0

    // For simplicity just multicall it all and then parse afterwards
    positions.forEach((pool) => {
      if (pool.nitroPoolAddress) {
        poolIndexes.push({
          nftPoolAddress: pool.nftPoolAddress,
          nitroPoolAddress: pool.nitroPoolAddress,
          resultIndex,
        })

        calls.push({
          address: pool.nitroPoolAddress,
          name: 'userTokenIdsLength',
          params: [account],
        })

        calls.push({
          address: pool.nitroPoolAddress,
          name: 'pendingRewards',
          params: [account],
        })

        resultIndex++
      }
    })

    const abi = [
      'function userTokenIdsLength(address account) external view returns (uint256)',
      'function pendingRewards(address) external view returns (address[] tokens, uint256[] rewardAmounts)',
      'function userTokenId(address account, uint256 index) external view returns (uint256)',
    ]

    const [tokenIdCountList, pendingRewards] = await multicall(abi, calls)

    poolIndexes.forEach((info) => {
      const position = positions.find((p) => p.nitroPoolAddress === info.nitroPoolAddress)

      position.nitroUserInfo = {
        spNftDepositCount: tokenIdCountList[info.resultIndex]?.toNumber() || 0,
        pendingNitroRewards: [
          {
            token: pendingRewards.tokens[0],
            pendingReward: formatEthersToFloat(pendingRewards.rewardAmounts[0]),
          },
        ],
      }
    })

    for (const position of positions) {
      if (position.nitroUserInfo?.spNftDepositCount > 0) {
        position.hasNitroDeposit = true
        // const tokenIdCalls: Call[] = []
        // let idx = 0
        // while (idx <= position.nitroUserInfo.spNftDepositCount) {
        //   tokenIdCalls.push({
        //     address: position.nitroPoolAddress,
        //     name: 'userTokenId',
        //     params: [account, idx],
        //   })

        //   idx++
        // }

        // tokenIdCalls.push({
        //   address: position.nitroPoolAddress,
        //   name: 'userTokenId',
        //   params: [account, 0],
        // })

        // // Swap token id's reference to users token id's in the nitro pool so they can withdraw
        const nitro = new Contract(position.nitroPoolAddress, abi, defaultRpcProvider)
        const tokenId = await nitro.userTokenId(account, 0)
        position.tokenIds = [tokenId.toNumber()]
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export const fetchNftPositions = async (account: string, chainId: number): Promise<IPositionInfo[]> => {
  if (!account) return []

  const poolConfigs = getNftPoolConfigs(chainId)
  const nftPoolAddresses = poolConfigs.map((conf) => conf.nftPoolAddress[chainId])
  const lpTokenAddresses = poolConfigs.map((conf) => conf.lpAddresses[chainId])
  // const nitroPoolAddresses = poolConfigs.map((conf) =>
  //   conf.nitroPoolAddressMap && conf.nitroPoolAddressMap[chainId] ? conf.nitroPoolAddressMap[chainId] : null,
  // )

  const pools: any[] = nftPoolAddresses.map((nftPoolAddress) => {
    return {
      nftPoolAddress,
    }
  })

  const calls: Call[] = []
  pools.forEach((pool, idx) => {
    // pool.nitroPoolAddress = nitroPoolAddresses[idx]
    // How many NFT positions user has for pool
    calls.push({
      address: pool.nftPoolAddress,
      name: 'balanceOf',
      params: [account],
    })
  })

  const lpBalanceCalls: Call[] = []
  lpTokenAddresses.forEach((lp) => {
    lpBalanceCalls.push({
      address: lp,
      name: 'balanceOf',
      params: [account],
    })
  })

  const [nftBalances, lpBalances] = await Promise.all([
    multicall(nftPoolAbi, calls),
    multicall(ERC20_ABI, lpBalanceCalls),
  ])

  nftBalances.flat().forEach((bal, idx) => {
    pools[idx].nftBalance = bal.toNumber()
  })

  lpBalances.flat().forEach((bal, idx) => {
    pools[idx].userLpBalance = bal.toString()
  })

  // const nonNitro = pools.filter((p) => !p.nitroPoolAddress)
  // const withNitro = pools.filter((p) => p.nitroPoolAddress)

  // for (const pool of withNitro) {

  // }

  // Attach nitro user info to associated position
  // await getUserNitroDepositBalances(account, pools)

  // console.log(pools)

  await getAllTokenIds(pools, account)

  // So if user us in nitro pool, the token ID's need to be used to get pending
  // User does not currently "own" the position
  await getRewardsInfo(pools, chainId)

  return pools
}

export const fetchNftPoolAllowances = async (account: string, chainId: number): Promise<NFTPoolAllowance[]> => {
  const poolConfigs = getNftPoolConfigs(chainId)
  const nftPoolAddresses = poolConfigs.map((f) => f.nftPoolAddress[chainId])

  const allowanceCalls: Call[] = []
  poolConfigs.forEach((conf) => {
    allowanceCalls.push({
      address: conf.lpAddresses[chainId],
      name: 'allowance',
      params: [account, conf.nftPoolAddress[chainId]],
    })
  })

  let allowances = await multicall(
    ['function allowance(address, address) public view returns (uint256)'],
    allowanceCalls,
  )
  allowances = allowances.flat()

  const poolAllowances = nftPoolAddresses.map((poolAddress, idx) => {
    return {
      poolAddress,
      hasLpApproval: allowances[idx].gt(0),
    }
  })

  return poolAllowances
}

export const fetchUserNftPoolBalances = async (account: string, chainId: number): Promise<UserNFTPoolInfo[]> => {
  const poolConfigs = getNftPoolConfigs(chainId)
  const nftPoolAddresses = poolConfigs.map((f) => f.nftPoolAddress[chainId])

  const calls: Call[] = []
  nftPoolAddresses.forEach((address) => {
    calls.push({
      address,
      name: 'balanceOf',
      params: [account],
    })
  })

  const userNftBalances = await multicall(nftPoolAbi, calls)
  const balances = userNftBalances.flat()

  return nftPoolAddresses.map((address, idx) => {
    return {
      poolAddress: address,
      balance: balances[idx].toNumber(),
      userLpData: defaultUserLpData,
    }
  })
}

// // TODO: Get tokenreward ratios
// async function getPoolSettings(chainId: number) {
//   const poolConfigs = getNftPoolConfigs(chainId)
//   const nftPoolAddresses = poolConfigs.map((f) => f.nftPoolAddress[chainId])

//   const calls: Call[] = []
//   nftPoolAddresses.forEach((address) => {
//     calls.push({
//       address,
//       name: 'balanceOf',
//     })
//   })
// }

async function getAllTokenIds(pools: IPositionInfo[], account: string) {
  const calldata = []

  pools.forEach((pool) => {
    if (pool.nftBalance > 0) {
      calldata.push({
        ...pool,
        call: {
          address: pool.nftPoolAddress,
          name: 'tokenOfOwnerByIndex',
          params: [account, 0], // just getting first positions token id for now
        },
      })
    }
  })

  const data = await multicall(
    nftPoolAbi,
    calldata.map((data) => data.call),
  )
  const tokenIds: number[] = data.flat().map((id) => id.toNumber())

  calldata.forEach((data, idx) => {
    const pool = pools.find((p) => p.nftPoolAddress == data.nftPoolAddress)
    pool.tokenIds = [tokenIds[idx]]
  })

  pools.forEach((pool) => (pool.tokenIds = pool.tokenIds || []))

  return tokenIds
}

async function getRewardsInfo(pools: IPositionInfo[], chainId: number) {
  const calls = []
  const rewardCalls = []

  const positions = pools.filter((p) => p.tokenIds.length > 0)

  positions.forEach((pool) => {
    pool.tokenIds.forEach((tokenId) => {
      calls.push({
        address: pool.nftPoolAddress,
        name: 'getStakingPosition', // to get the amount("stakedBalance")
        params: [tokenId],
      })

      rewardCalls.push({
        address: pool.nftPoolAddress,
        name: 'pendingRewards',
        params: [tokenId],
      })
    })
  })

  const [info, rewards] = await Promise.all([multicall(nftPoolAbi, calls), multicall(nftPoolAbi, rewardCalls)])

  positions.forEach((position, idx) => {
    const stakingInfo = info[idx]
    const rewardInfo = rewards[idx]

    // This is the combined token/xToken amount so needs to be split up
    // TODO: Pool could have different settings than 80/20
    // Use pool contract to get current settings
    const totalMainAmount = rewardInfo.mainAmount
    const xTokenAmount = totalMainAmount.mul(80).div(100)
    const mainTokenAmount = totalMainAmount.sub(xTokenAmount)

    const baseRewards = [
      {
        token: getTokenAddress('ProtocolToken', chainId),
        pendingReward: 0,
      },
      {
        token: getTokenAddress('xProtocolToken', chainId),
        pendingReward: 0,
      },
      {
        token: getTokenAddress('BSWAP', chainId),
        pendingReward: 0,
      },
    ]

    baseRewards[0].pendingReward = formatEthersToFloat(mainTokenAmount)
    baseRewards[1].pendingReward = formatEthersToFloat(xTokenAmount)
    baseRewards[2].pendingReward = formatEthersToFloat(rewardInfo.wethAmount)

    position.stakedBalance = new BigNumber(stakingInfo.amount.toString()).toJSON()
    position.pendingRewards = baseRewards
  })
}
