import { Currency } from '@magikswap/sdk'
import { Box, Text, AddIcon, CardBody, Button, CardFooter, Flex } from '@pancakeswap/uikit'
import { CurrencySelect } from 'components/CurrencySelect'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppHeader } from '../../components/App'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import 'animate.css'
import { TbKarate } from 'react-icons/tb'

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  return (
    <>
      <AppHeader title={t('BACK')} subtitle={t('')} helper={t('')} backTo="/liquidity" />
      <CardBody>
        <Box>
          <Flex flexDirection="row" alignItems="center" justifyContent="center" marginBottom="12px">
            <Text textTransform="uppercase" color="text" fontWeight="400" fontSize="1.2rem" marginRight="4px">
              {t('Choose your fighter')}
            </Text>
            <TbKarate width="36px" height="36px" style={{ color: '#0154FE' }} />
          </Flex>
          <FlexGap gap="4px">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={currencyA}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
            />
            <AddIcon color="textSubtle" />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={currencyB}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
            />
          </FlexGap>
        </Box>
      </CardBody>
      <CardFooter>
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button
            className="animate__animated animate__rollIn animate__faster"
            data-test="choose-pair-next"
            width="100%"
            variant={!isValid ? 'danger' : 'primary'}
            onClick={onNext}
            disabled={!isValid}
          >
            {error ?? t('Add Liquidity')}
          </Button>
        )}
      </CardFooter>
    </>
  )
}
