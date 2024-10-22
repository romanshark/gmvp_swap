import { 
  // useMemo, 
  useState } from 'react'
import styled from 'styled-components'
import { 
  // Trade, TradeType,  
  Percent, JSBI } from '@magikswap/sdk'
import { Button, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/swap/actions'
import {
  // computeSlippageAdjustedAmounts,
  // computeTradePriceBreakdown,
  formatExecutionPriceOdos,
  warningSeverity,
} from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
// import { TOTAL_FEE, LP_HOLDERS_FEE, TREASURY_FEE, BUYBACK_FEE } from 'config/constants/info'
// import useMatchBreakpoints from '@pancakeswap/uikit/src/hooks/useMatchBreakpoints'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { BIPS_BASE } from 'config/constants/exchange'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px; 
  border: 1px solid ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.gradients.basedsex};
`

export default function SwapModalFooter({
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  swapData,
  inputCurrency,
  outputCurrency,
  formattedAmounts,
}: {
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  swapData: any
  inputCurrency: any
  outputCurrency: any
  formattedAmounts: any
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const priceImpactSD = (-100 * swapData.priceImpact).toFixed(0)
  const priceImpactWithoutFee = new Percent(JSBI.BigInt(priceImpactSD), BIPS_BASE)

  const severity = warningSeverity(priceImpactWithoutFee)
  // const { isMobile } = useMatchBreakpoints()

  const inputAmount = parseInt(swapData?.inAmounts[0]) / 10 ** inputCurrency?.decimals
  const outputAmount = parseInt(swapData?.outAmounts[0]) / 10 ** outputCurrency?.decimals

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Text fontSize="14px">{t('Price')}</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPriceOdos(inputAmount, outputAmount, inputCurrency, outputCurrency, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">
              {t('Minimum received')}
            </Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">{(parseFloat(formattedAmounts[Field.OUTPUT]) * (1 - allowedSlippage / 10000)).toFixed(4)}</Text>
            <Text fontSize="14px" marginLeft="4px">
              {outputCurrency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              text={t('The difference between the market price and your price due to trade size.')}
              ml="4px"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={false}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? t('Swap Anyway') : t('CONFIRM SWAP')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}