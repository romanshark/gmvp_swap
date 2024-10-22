import { useCallback } from 'react'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

interface ConfirmSwapModalProps {
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  assembledTransaction: any
  swapData: any
  inputCurrency: any
  outputCurrency: any
  formattedAmounts: any
  loadingConfirm: boolean
}

const ConfirmSwapModal: React.FC<InjectedModalProps & ConfirmSwapModalProps> = ({
  allowedSlippage,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
  swapData,
  inputCurrency,
  outputCurrency,
  formattedAmounts,
  loadingConfirm,
}) => {

  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return swapData ? (
      <SwapModalHeader
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        swapData={swapData}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        formattedAmounts={formattedAmounts}
      />
    ) : null
  }, [allowedSlippage, recipient, formattedAmounts, inputCurrency, outputCurrency, swapData])

  const modalBottom = useCallback(() => {
    return swapData ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
        swapData={swapData}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        formattedAmounts={formattedAmounts}
      />
    ) : null
  }, [allowedSlippage, onConfirm, swapErrorMessage, formattedAmounts, inputCurrency, outputCurrency, swapData])

  const inputAmount = parseInt(swapData?.inAmounts[0]) / 10 ** inputCurrency?.decimals
  const outputAmount = parseInt(swapData?.outAmounts[0]) / 10 ** outputCurrency?.decimals

  // text to show while loading
  const pendingText = t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: inputAmount,
    symbolA: inputCurrency?.symbol ?? '',
    amountB: outputAmount,
    symbolB: outputCurrency?.symbol ?? '',
  })

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('CONFIRM SWAP')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      // @ts-ignore
      content={confirmationContent}
      pendingText={pendingText}
      // currencyToAdd={trade?.outputAmount.currency}
      currencyToAdd={outputCurrency}
      loadingConfirm={loadingConfirm}
    />
  )
}

export default ConfirmSwapModal