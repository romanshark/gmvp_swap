import { 
  // Trade, 
  Percent, JSBI } from '@magikswap/sdk'
import { Text, ArrowDownIcon, Flex } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@pancakeswap/localization'
import { warningSeverity } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import tryParseAmount from 'utils/tryParseAmount'
import { TruncatedText } from './styleds'
import { BIPS_BASE } from 'config/constants/exchange'
import styled from 'styled-components'

const SwapFlow=styled(Flex)`
  flex-direction: row; 
  justify-content: center; 
  align-items: center; 
  padding-left: 0.5rem; 
  padding-right: 0.5rem; 
  
`


export default function SwapModalHeader({
  allowedSlippage,
  recipient,
  swapData,
  inputCurrency,
  outputCurrency,
  formattedAmounts,
}: {
  allowedSlippage: number
  recipient: string | null
  swapData: any
  inputCurrency: any
  outputCurrency: any
  formattedAmounts: any
}) {
  const { t } = useTranslation()
  const priceImpactSD = (-100 * swapData.priceImpact).toFixed(0)
  const priceImpactWithoutFee = new Percent(JSBI.BigInt(priceImpactSD), BIPS_BASE)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const amount = parseInt(formattedAmounts[Field.OUTPUT]) * (1 - allowedSlippage / 10000)
  const { symbol } = outputCurrency

  const tradeInfoText = t(
    'The output amount for this swap is estimated above. You will receive at least %amount% %symbol% or the transaction will revert.  Quote will update every 15 seconds for the next 3 minutes.',
    {
      amount,
      symbol,
    },
  )

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  const inputAmount = parseInt(swapData?.inAmounts[0]) / 10 ** inputCurrency?.decimals
  const outputAmount = parseInt(swapData?.outAmounts[0]) / 10 ** outputCurrency?.decimals


  return (
  <Flex flexDirection="column" >
    <SwapFlow>
        <CurrencyLogo currency={inputCurrency} size="48px" 
            style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF' }} 
            />
        <Flex flexDirection="row" marginLeft="1.5rem">
            <Text fontSize="32px" color='text' marginRight="8px" >
                {tryParseAmount(inputAmount.toString(), inputCurrency)?.toSignificant(6) ?? ''}
            </Text>
            <Text fontSize="32px" >
              {inputCurrency.symbol}
            </Text>
        </Flex>
    </SwapFlow>

    <ArrowDownIcon width="32px" ml="0px" />
    
  <SwapFlow marginTop="1rem">
    <CurrencyLogo currency={outputCurrency} size="48px"
      style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF' }} 
    />
    
    <Flex flexDirection="row" marginLeft="1.5rem">
        <Text 
              marginRight="8px" 
              fontSize="32px"
              color={
                priceImpactSeverity > 2
                  ? 'failure'
                  : 'text'
              } >
            {tryParseAmount(outputAmount.toString(), outputCurrency)?.toSignificant(6) ?? ''}
        </Text>
        <Text fontSize="32px" ml="0px">
          {outputCurrency.symbol}
        </Text>
        </Flex>
  </SwapFlow>
    
    <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px', maxWidth: '650px' }}>
      <Text fontSize="14px" color="text" textAlign="left" style={{ width: '100%' }}>
        {estimatedText}
        <b>
          {amount} {symbol}
        </b>
        {transactionRevertText}
      </Text>
    </AutoColumn>
    {recipient !== null ? (
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        <Text color="textSubtle">
          {recipientSentToText}
          <b title={recipient}>{truncatedRecipient}</b>
          {postSentToText}
        </Text>
      </AutoColumn>
    ) : null}
  </Flex>
  )
}