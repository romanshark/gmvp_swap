import { FeeAmount } from '@baseswapfi/v3-sdk2'
import Badge from 'components/Badge'
import Trans from 'components/Trans'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { PoolState } from 'hooks/v3/usePools'
import React from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'

export function FeeTierPercentageBadge({
  feeAmount,
  distributions,
  poolState,
}: {
  feeAmount: FeeAmount
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
}) {
  const { t } = useTranslation()

  return (
    
      <Text fontSize={10}>
        {!distributions || poolState === PoolState.NOT_EXISTS || poolState === PoolState.INVALID ? (
          <Trans>Not created</Trans>
        ) : distributions[feeAmount] !== undefined ? (
          <Text fontSize="12px" textAlign="center"  color='primaryBright'>
            {t(`${distributions[feeAmount]?.toFixed(0)}% of investors select this fee tier`)}
          </Text>
        ) : (
          <Trans>No data</Trans>
        )}
      </Text>

  )
}
