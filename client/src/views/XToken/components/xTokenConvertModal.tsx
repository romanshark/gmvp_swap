import React, { useState } from 'react'
import { Button, Modal, Text, Flex, Box, BalanceInput } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from '@pancakeswap/localization'
import { useBSX, useXToken } from 'hooks/useContract'
import { MaxUint256 } from '@ethersproject/constants'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { requiresApproval } from 'utils/requiresApproval'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { parseUnits } from '@ethersproject/units'
import useXTokenActions from '../hooks/useXTokenActions'

interface XTokenConvertModalProps {
  stakingTokenBalance: BigNumber
  stakingTokenPrice: BigNumber
  onDismiss?: () => void
}

const XTokenConvertModal: React.FC<XTokenConvertModalProps> = ({
  stakingTokenBalance,
  stakingTokenPrice,
  onDismiss,
}) => {
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeValueUSD, setStakeValueUSD] = useState('0')

  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { convertToXToken, pendingTx } = useXTokenActions()

  const xToken = useXToken()
  const { reader: cakeContractReader, signer: cakeContractApprover } = useBSX()

  const { isApproving, isApproved, handleApprove } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(cakeContractReader, account, xToken.address)
    },
    onApprove: () => {
      return callWithGasPrice(cakeContractApprover, 'approve', [xToken.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract enabled - you can now convert to xBSX'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      return callWithGasPrice(xToken, 'convert', [parseUnits(stakeAmount)])
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(t('Conversion to xBSX complete!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDismiss?.()
    },
  })

  const handleConfirmClick = async () => {
    const receipt = await convertToXToken(stakeAmount)

    if (receipt?.status) {
      toastSuccess(
        `Conversion complete!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your token conversion has been completed!')}
        </ToastDescriptionWithTx>,
      )
    }

    setStakeAmount('')
    setStakeValueUSD('0')
    onDismiss?.()
  }

  function handleInputChange(amount: string) {
    setStakeAmount(amount)
    const valueDisplay = getFullDisplayBalance(new BigNumber(amount).times(1e18).times(stakingTokenPrice), 18, 2)
    if (isNaN(parseFloat(valueDisplay))) {
      setStakeValueUSD('$0.00')
    } else {
      setStakeValueUSD('$' + valueDisplay)
    }
  }

  const handlePercentageClick = (percentage: number) => {
    const amountToStake = stakingTokenBalance.times(percentage).div(100)
    setStakeAmount(amountToStake.div(1e18).toString())
    setStakeValueUSD('$' + getFullDisplayBalance(amountToStake.times(stakingTokenPrice), 18, 2))
  }

  return (
    <Modal title="Convert to xBSX" onDismiss={onDismiss}>
      <Box>
        <Text fontSize="14px" textTransform="uppercase" letterSpacing="3px" color="#F86C0D" mb="12px">
          {`BSX Balance: ${getFullDisplayBalance(stakingTokenBalance, 18, 4)}`}
        </Text>
        <BalanceInput
          style={{ boxShadow: '0 0 4px #fff', borderRadius: '12px' }}
          width="100%"
          value={stakeAmount}
          onUserInput={handleInputChange}
          currencyValue={stakeValueUSD}
          decimals={18}
        />
        <Flex my="16px" justifyContent="space-between">
          <Button className="emptyglow" variant="secondary" size="sm" onClick={() => handlePercentageClick(25)}>
            25%
          </Button>
          <Button className="emptyglow" variant="secondary" size="sm" onClick={() => handlePercentageClick(50)}>
            50%
          </Button>
          <Button className="emptyglow" variant="secondary" size="sm" onClick={() => handlePercentageClick(75)}>
            75%
          </Button>
          <Button className="emptyglow" variant="secondary" size="sm" onClick={() => handlePercentageClick(100)}>
            100%
          </Button>
        </Flex>
      </Box>

      {isApproved ? (
        <Button
          width="100%"
          disabled={
            stakeAmount === '' || new BigNumber(stakeAmount).isZero() || stakingTokenBalance.isZero() || pendingTx
          }
          onClick={handleConfirmClick}
          mt="8px"
          variant="secondary"
          className="connectglow"
        >
          Confirm
        </Button>
      ) : (
        <Button width="100%" disabled={isApproving} onClick={handleApprove} mt="8px" variant="secondary">
          Approve BSX
        </Button>
      )}
    </Modal>
  )
}

export default XTokenConvertModal
