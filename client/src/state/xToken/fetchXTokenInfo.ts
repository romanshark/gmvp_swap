import { getTokenAddress } from 'config/constants/token-info'
import { getXToken, getBep20Contract } from 'utils/contractHelpers'
import { UserXTokenInfo, UserXTokenVestingInfo, VestingInfo } from './types'
import multicall, { Call } from 'utils/multicall'
import xTokenAbi from '../../config/abi/XToken.json'
import { formatEther } from '@ethersproject/units'

export const fetchUserXTokenInfo = async (account: string, chainId: number): Promise<UserXTokenInfo> => {
  const xToken = getXToken(chainId)
  const protocolToken = getBep20Contract(getTokenAddress('ProtocolToken', chainId))

  const [mainTokenBalance, xTokenBalance, balances] = await Promise.all([
    protocolToken.balanceOf(account),
    xToken.balanceOf(account),
    xToken.getxTokenBalance(account),
  ])

  return {
    isLoading: false,
    protocolTokenBalance: mainTokenBalance.toString(),
    xTokenBalance: xTokenBalance.toString(),
    xTokenTotalBalance: xTokenBalance.add(balances.redeemingAmount).toString(),
    xTokenReedeemingBalance: balances.redeemingAmount.toString(),
  }
}

export const fetchUserXTokenRedeemsInfo = async (account: string, chainId: number): Promise<UserXTokenVestingInfo> => {
  const xToken = getXToken(chainId)
  const redeemsLength = await xToken.getUserRedeemsLength(account)

  const redemptionCount = redeemsLength.toNumber()
  let vestingList: VestingInfo[] = []

  if (redemptionCount > 0) {
    const calls: Call[] = []
    let count = 0

    while (count < redemptionCount) {
      calls.push({
        address: xToken.address,
        name: 'getUserRedeem',
        params: [account, count],
      })

      count++
    }

    const vestings: any[] = await multicall(xTokenAbi, calls)

    vestingList = vestings.map((v, idx) => {
      const canFinalize = Date.now() >= v.endTime * 1000

      return {
        arxAmount: formatEther(v.amount),
        xArxAmount: formatEther(v.xTokenAmount),
        endTime: new Date(v.endTime * 1000).toUTCString(),
        redeemIndex: idx,
        canFinalize,
      }
    })
  }

  return {
    redemptionCount,
    vestingList,
  }
}
