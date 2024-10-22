import BigNumber from 'bignumber.js'

import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import { TokenPairImage } from 'components/TokenImage'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import CardActions from './CardActions'
import { BoostTag } from 'components/Tags'

const PoolCard: React.FC<{ pool: DeserializedPool; account: string; showStakedOnly: boolean }> = ({ pool, account, showStakedOnly }) => {
  const { stakingToken, earningToken, isFinished, isBoost, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const isCakePool = earningToken.symbol === 'BSWAP' && stakingToken.symbol === 'BSWAP'

  return (
    <>
      {showStakedOnly && accountHasStakedBalance || !showStakedOnly && <StyledCard
        isFinished={isFinished}
        ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
      >
        <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished}>
          <PoolCardHeaderTitle
            title={isCakePool ? t('Manual') : t('EARN %asset%', { asset: earningToken.symbol })}
            subTitle={isCakePool ? t('Earn BSWAP, stake BSWAP') : t('STAKE %symbol%', { symbol: stakingToken.symbol })}
          />
          {isBoost ? <BoostTag /> : null}
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
        </PoolCardHeader>
        <CardBody >
          <Flex flexDirection="row" justifyContent="space-between">
            <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
              Deposit Fee:
            </Text>
            <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
              1%
            </Text>
          </Flex>
          <AprRow pool={pool} stakedBalance={stakedBalance} />
          <Flex padding="12px" mt="24px" borderRadius="8px"
            flexDirection="column" backgroundColor="backgroundAlt" style={{ boxShadow: '0 0 8px #000' }} >
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <ConnectWalletButton />
              </>
            )}
          </Flex>
        </CardBody>
        <CardFooter pool={pool} account={account} />
      </StyledCard>}
    </>
  )
}

export default PoolCard
