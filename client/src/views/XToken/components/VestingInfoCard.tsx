import { Button, Card, Flex, Text } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import React from 'react'
import { BsArrowRightCircle } from 'react-icons/bs'
import { VestingInfo } from 'state/xToken/types'
import styled from 'styled-components'
import { ToastDescriptionWithTx } from 'components/Toast'
import useXTokenActions from '../hooks/useXTokenActions'

export const TopHalf = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  border-image: linear-gradient(100deg, #0154fd, #68b9ff) 1;
  border-bottom: 2px;
  border-style: solid;
  padding-bottom: 4px;
`
export const VestingCard = styled(Card)`
  margin: 6px;
  margin-bottom: 18px; 
  min-width: 300px;
  max-width: 100%;
  border: 2px solid white; 
  border-radius: 8px; 
  display: flex;
  flex-direction column;
  padding: 1rem;
`

interface VestingCardProps {
  vesting: VestingInfo
}

const VestingInfoCard: React.FC<VestingCardProps> = ({ vesting }) => {
  const { toastSuccess } = useToast()
  const { cancelVesting, finalizeVesting, pendingTx } = useXTokenActions()

  async function handleAction(action: 'cancel' | 'finalize') {
    const call = action === 'cancel' ? cancelVesting : finalizeVesting
    const message = action === 'cancel' ? 'Vesting cancelation complete' : 'Vesting finaized'

    const receipt = await call(vesting.redeemIndex)

    if (receipt?.status) {
      toastSuccess(``, <ToastDescriptionWithTx txHash={receipt.transactionHash}>{message}!</ToastDescriptionWithTx>)
    }
  }

  return (
    <VestingCard>
      <TopHalf>
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.xArxAmount} xBSX
        </Text>
        <BsArrowRightCircle size={25} />
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.endTime}
        </Text>
        <BsArrowRightCircle size={25} />
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.arxAmount} BSX
        </Text>
      </TopHalf>

      <Flex justifyContent={['center', null, null, 'center']} mt="8px" mb="0rem">
        <Button
          variant={!vesting.canFinalize || pendingTx ? 'primary' : 'primary'}
          marginX="1rem"
          marginBottom="8px"
          disabled={!vesting.canFinalize || pendingTx}
          onClick={() => handleAction('finalize')}
        >
          Claim
        </Button>

        <Button
          variant="secondary"
          marginX="1rem"
          disabled={vesting.canFinalize || pendingTx}
          onClick={() => handleAction('cancel')}
        >
          Cancel
        </Button>
      </Flex>
    </VestingCard>
  )
}

export default VestingInfoCard
