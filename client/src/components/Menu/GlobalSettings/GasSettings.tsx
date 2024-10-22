import { Flex, Button, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from '@pancakeswap/localization'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'
import { BiGasPump } from 'react-icons/bi'
import styled from 'styled-components'
import { SettingsBox, Frame } from './SettingsBox'

const GasIcon = styled(BiGasPump)`
  width: 48px;
  height: 48px;
  color: #fff;
`

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const { isMobile } = useMatchBreakpointsContext()

  return (
    <SettingsBox flexDirection="column">
      <Flex mb="8px" alignItems="center" justifyContent="center">
        <GasIcon />
        <Text
          marginLeft="3px"
          marginRight="2px"
          textAlign="center"
          fontSize={isMobile ? '2rem' : '1rem'}
          fontWeight="400"
          color="#fff"
        >
          {t('SPEED')}
        </Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher gas price = higher speed = higher cost!',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex marginTop="8px" justifyContent="space-between" alignItems="center" paddingX={isMobile ? '0rem' : '1rem'}>
        <Button
          mr="4px"
          scale="pawg"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'gason' : 'gasoff'}
        >
          <Text fontSize="12px">{t('Basic (%gasPrice%)', { gasPrice: GAS_PRICE.default })}</Text>
        </Button>
        <Button
          mr="4px"
          scale="pawg"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'gason' : 'gasoff'}
        >
          <Text fontSize="12px">{t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}</Text>
        </Button>
        <Button
          mr="4px"
          scale="pawg"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'gason' : 'gasoff'}
        >
          <Text fontSize="12px">{t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}</Text>
        </Button>
      </Flex>
    </SettingsBox>
  )
}

export default GasSettings
