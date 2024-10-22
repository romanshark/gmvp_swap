import { FeeAmount } from '@baseswapfi/v3-sdk2'
import { Text, Button, promotedGradient } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { PoolState } from 'hooks/v3/usePools'
import React from 'react'
import styled, { css } from 'styled-components'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'
import { useTranslation } from '@pancakeswap/localization'
import { FeeSelectCard } from 'components/Card'

const ResponsiveText = styled(Text)`
  font-size: 16px;
`
const FeeOptionContainer = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 100%;
  animation: ${promotedGradient} 4s ease infinite;
  ${({ active }) =>
    active &&
    css`
      box-shadow: 0 0 4px #fff; 
    `}
  border-radius: 12px;
  padding: 0px; 
  &:hover {
    opacity: 0.7;
  }
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({ feeAmount, active, poolState, distributions, onClick }: FeeOptionProps) {
  const { t } = useTranslation()

  return (
    <FeeOptionContainer active={active} onClick={onClick}>
      <FeeSelectCard active={active} height="100%">
        <AutoColumn justify="center">
          <ResponsiveText>{t(`${FEE_AMOUNT_DETAIL[feeAmount].label}%`)}</ResponsiveText>
          <Text fontWeight={400} fontSize="12px">
            {FEE_AMOUNT_DETAIL[feeAmount].description}
          </Text>

          {distributions && (
            <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
          )}
        </AutoColumn>
      </FeeSelectCard>
    </FeeOptionContainer>
  )
}
