import styled from 'styled-components'
import { Button, Flex, IconButton, AddIcon, MinusIcon, useModal, Text } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useRouter } from 'next/router'
import { useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import { FarmWithStakedValue } from '../types'
import StakedLP from '../StakedLP'
import useCreateNftPoolPosition from 'views/xFarms/hooks/useCreateNftPoolPosition'
import { BIG_ZERO } from 'utils/bigNumber'
import useWithdrawNftPoolPosition from 'views/xFarms/hooks/useWithdrawNftPosition'
import useAddToNftPoolPosition from 'views/xFarms/hooks/useAddToNftPoolPosition'
import useNftPools from 'views/xFarms/hooks/useNftPools'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
}

const IconButtonWrapper = styled.div`
  display: flex;

`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  quoteToken,
  token,
  lpSymbol,
  multiplier,
  apr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  nftPoolAddress,
  sharePrice,
  lpPrice,
}) => {
  const { chainId } = useWeb3React()
  const { t } = useTranslation()
  const cakePrice = usePriceCakeBusd()
  const router = useRouter()

  // const lpPrice = useLpTokenPrice(lpSymbol)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const { fetchAllData, getInitialPoolPosition } = useNftPools()

  const nftPool = nftPoolAddress[chainId]
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const stakedBalance = position?.stakedBalance || BIG_ZERO
  const tokenId = position?.tokenIds[0]
  const stakedBalanceBN = useMemo(() => new BigNumber(stakedBalance), [stakedBalance])

  const { createNftPoolPosition } = useCreateNftPoolPosition(nftPool)
  const { addToNftPoolPosition } = useAddToNftPoolPosition(position?.nftPoolAddress)
  const { withdrawNftPoolPosition } = useWithdrawNftPoolPosition(nftPool)

  const handleStake = async (amount: string) => {
    if (!amount || parseFloat(amount) === 0) return

    // TODO: While only allowing a single position per pool we have to intercept and act accordingly
    const receipt = await fetchWithCatchTxError(() => {
      if (stakedBalanceBN.gt(0)) {
        return addToNftPoolPosition(position?.tokenIds[0], amount)
      }

      return createNftPoolPosition(amount)
    })

    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )

      fetchAllData()
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return withdrawNftPoolPosition(tokenId, amount)
    })

    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )

      fetchAllData()
    }
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={new BigNumber(position?.userLpBalance || 0)}
      stakedBalance={stakedBalanceBN}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={new BigNumber(lpPrice)}
      lpLabel={lpLabel}
      apr={apr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalanceBN} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )

  const renderStakingButtons = () => {
    return !position || stakedBalanceBN.eq(0) ? (
      <Button
        variant="primary"
        onClick={onPresentDeposit}
        disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
      >
        {t('Deposit')}
      </Button>
    ) : (
      <>
        <IconButtonWrapper>
          <IconButton
            variant="plusminus"
            onClick={onPresentWithdraw}
            marginRight="6px"
            disabled={position?.hasNitroDeposit}
          >
            <MinusIcon color="text" width="32px"   />
          </IconButton>

          <IconButton
            variant="plusminus"
            onClick={onPresentDeposit}
            disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
          >
            <AddIcon color="#fff" width="32px"  />
          </IconButton>
        </IconButtonWrapper>
      </>
    )
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <StakedLP
          stakedBalance={stakedBalanceBN}
          lpSymbol={lpSymbol}
          quoteTokenSymbol={quoteToken.symbol}
          tokenSymbol={token.symbol}
          lpTotalSupply={lpTotalSupply}
          tokenAmountTotal={tokenAmountTotal}
          quoteTokenAmountTotal={quoteTokenAmountTotal}
          sharePrice={sharePrice}
          lpPrice={lpPrice}
        />
        {renderStakingButtons()}
      </Flex>
      <Flex justifyContent="flex-end" mt={1}>
        {position?.hasNitroDeposit && <Text>Unstake spNFT to withdraw</Text>}
      </Flex>
    </>
  )
}

export default StakeAction
