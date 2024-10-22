import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpointsContext, Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../../Apr'
import { BoostTag } from 'components/Tags'

interface AprCellProps {
  pool: DeserializedPool
}

const AprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const { userData, isBoost } = pool
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  return (
    <BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APR')}
        </Text>
        <Apr pool={pool} stakedBalance={stakedBalance} showIcon={!isMobile} />
       
      </CellContent>
      {isBoost ? <Flex marginTop="0.2rem" width="50%"><BoostTag /> </Flex>: null }
    </BaseCell>
  )
}

export default AprCell
