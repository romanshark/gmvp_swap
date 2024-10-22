import { Button, Flex, Text, TokenImage } from '@pancakeswap/uikit'
import { IPositionInfo } from 'state/xFarms/types'
import styled, { css } from 'styled-components'
import useTokenPrices from 'hooks/useTokenPrices'
import { useTranslation } from '@pancakeswap/localization'
import { getTokenAddress, getTokenImage, getTokenInstance } from 'config/constants/token-info'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

interface PendingRewardProps {
  position: IPositionInfo
  harvestPosition: () => Promise<any>
  title?: string
  nitro?: boolean
  pendingTx?: boolean
  table?: boolean
}

interface StyledButtonProps {
  table?: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps>`
${({ table }) =>
    table
      ? css`
      margin-top: 12px;
    `
      : css`
      margin-top: 0px;
    `}
`


const PendingRewards: React.FC<PendingRewardProps> = ({
  position,
  harvestPosition,
  title = 'Earned Rewards',
  nitro,
  pendingTx,
  table
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { getValueForAmount } = useTokenPrices()
  // const { toastSuccess } = useToast()
  // const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  // const { fetchAllData } = useNftPools()
  // const tokenId = position?.tokenIds[0]
  let rewardsList = []
  if (nitro) {
    rewardsList = position?.nitroUserInfo?.pendingNitroRewards || []
  } else {
    rewardsList = position?.pendingRewards || []
  }

  const xTokenAddress = useMemo(() => getTokenAddress('xProtocolToken', chainId), [chainId])
  const arxAddress = useMemo(() => getTokenAddress('ProtocolToken', chainId), [chainId])
  const bswapAddress = useMemo(() => getTokenAddress('BSWAP', chainId), [chainId])

  let hasRewards = false

  const mappedRewards = rewardsList.map((rw) => {
    const tokenAddress = rw.token == xTokenAddress ? arxAddress : rw.token
    const { valueLabel } = getValueForAmount(tokenAddress, rw.pendingReward)
    const rewardAmountDisplay = rw.pendingReward.toFixed(4)

    if (parseFloat(rw.pendingReward) > 0) hasRewards = true

    return {
      ...rw,
      imgSrc: getTokenImage(rw.token),
      rewardAmountDisplay,
      valueLabel,
      token: getTokenInstance(rw.token),
    }
  })

  // const handleHarvest = useCallback(async () => {
  //   const receipt = await fetchWithCatchTxError(() => {
  //     return harvestPosition(tokenId)
  //   })

  //   if (receipt?.status) {
  //     toastSuccess(
  //       `${t('Harvest')}!`,
  //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //         {t('Your harvest has been claimed')}
  //       </ToastDescriptionWithTx>,
  //     )
  //   }

  //   fetchAllData()
  // }, [tokenId])

  return (
    <Flex flexDirection="column" width="100%" mt="16px">
      <Text bold textTransform="uppercase" color="background" fontSize="12px">{title}</Text>
      <Flex flexDirection="row" flexWrap={table? "nowrap" : "wrap"}>
        {mappedRewards.map((rw, i) => (
          <Flex key={i} alignItems="center" alignContent="center" mt="0px" ml="0px" width={['100%', '48%']}>
            <TokenImage src={rw.imgSrc} width={25} height={25} />

            <Flex ml="4px" flexDirection="column" alignItems="flex-start" mt="0px">
              <Text  fontSize="14px" bold textTransform="uppercase" color="white">
                {rw.token.symbol} 
              </Text>
              <Text  fontSize="12px" color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>
                {rw.rewardAmountDisplay}
              </Text>
              <Text  fontSize="14px" bold color={rw.pendingReward === 0 ? 'textDisabled' : 'background'}>
                {rw.valueLabel}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <StyledButton disabled={!hasRewards || pendingTx} onClick={harvestPosition} table={table}>
        CLAIM REWARDS
      </StyledButton>
    </Flex>
  )
}

export default PendingRewards
