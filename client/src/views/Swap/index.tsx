import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getProviderOrSigner } from 'utils'
import { CurrencyAmount, Token, Percent, JSBI } from '@magikswap/sdk'
import tryParseAmount from 'utils/tryParseAmount'
import { warningSeverity, formatExecutionPriceOdos } from 'utils/exchange'
import {
  Button,
  ButtonMenu,
  ToggleMe,
  ButtonMenuItem,
  Heading,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  BottomDrawer,
  ArrowUpDownIcon,
  Skeleton,
  useMatchBreakpointsContext,
  useModalRefetch,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { AppBodySwap, AppBody } from '../../components/App'
import QuestionHelper from 'components/QuestionHelper'
import Footer from 'components/Menu/Footer'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import PageHeader from 'components/PageHeader'
import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import { SwapCallbackError, Wrapper } from './components/styleds'
import ProgressSteps from './components/ProgressSteps'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTradeV3 } from '../../hooks/useApproveCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useSwapState,
  useSingleTokenSwapInfo,
  useSwapQuote,
  quoteAndAssemble,
  useDerivedSwapInfoOdos,
} from '../../state/swap/hooks'
import { useUserSlippageTolerance, useShowRoute } from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import { BIPS_BASE, BIG_INT_ZERO } from 'config/constants/exchange'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
// import { SchemaMetaFieldDef } from 'graphql'
import TypeIt from 'typeit-react'
import 'animate.css'
import { TWAP } from './components/TWAP'

const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 68px;
  }
`

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  border-radius: 8px;
  .icon-up-down {
    display: none;
  }
  &:hover {
    box-shadow: 0 0 4px #fff, 0 0 12px #0154fd;
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

export enum SwapType {
  REGULAR_SWAP,
  TWAP,
  LIMIT,
  CROSS_CHAIN_SWAP,
}

export default function Swap() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  // const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  // const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const [showRoute] = useShowRoute()
  const [assembledTransaction, setAssembledTransaction] = useState<any>(null)
  const [quoteData, setQuoteData] = useState<any>(null)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const Tabs = styled.div`
    padding: 0px 0px 24px 0px;
  `

  const [view, setView] = useState(SwapType.REGULAR_SWAP)

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  const TabsComponent: React.FC = () => (
    <Tabs>
      <ButtonMenu scale="sm" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ToggleMe style={{ height: 40 }}>{t('BaseSwap')}</ToggleMe>
        <ToggleMe style={{ height: 40 }}>{t('TWAP')}</ToggleMe>
        <ToggleMe style={{ height: 40 }}>{t('Limit')}</ToggleMe>
        <ToggleMe style={{ height: 40, whiteSpace: 'nowrap' }}>{t('Cross Chain Swap')}</ToggleMe>
      </ButtonMenu>
    </Tabs>
  )

  const isChartDisplayed = false
  const setIsChartDisplayed = null

  // useEffect(() => {
  //   setUserChartPreference(isChartDisplayed)
  // }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account, chainId, library } = useActiveWeb3React()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfoOdos(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const swapData = useSwapQuote(inputCurrency, outputCurrency, typedValue, allowedSlippage)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)
  const inputAmount = parseInt(swapData?.data?.inAmounts[0]) / 10 ** inputCurrency?.decimals
  const outputAmount = parseInt(swapData?.data?.outAmounts[0]) / 10 ** outputCurrency?.decimals

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: tryParseAmount(outputAmount.toString(), outputCurrency),
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? typedValue ?? ''
      : tryParseAmount(outputAmount.toString(), outputCurrency)?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO),
  )

  // check whether the user has approved the router on the input token
  // @ts-ignore
  const [approval, approveCallback] = useApproveCallbackFromTradeV3(inputCurrency, typedValue, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const sendTransaction = async () => {
    const signer = getProviderOrSigner(library, account)
    try {
      setSwapState({ attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined })
      // @ts-ignore
      const transactionResponse = await signer.sendTransaction({
        to: assembledTransaction.transaction.to,
        data: assembledTransaction.transaction.data,
        gasLimit: assembledTransaction.transaction.gas,
        gasPrice: assembledTransaction.transaction.gasPrice,
        nonce: assembledTransaction.transaction.nonce,
        value: assembledTransaction.transaction.value,
      })
      setSwapState({
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: transactionResponse.hash,
      })
    } catch (error) {
      setSwapState({
        attemptingTxn: false,
        // @ts-ignore
        swapErrorMessage: error.message,
        txHash: undefined,
      })
    }
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const priceImpactSD = swapData?.data && (-100 * swapData.data.priceImpact).toFixed(0)
  const priceImpactWithoutFee = priceImpactSD && new Percent(JSBI.BigInt(priceImpactSD), BIPS_BASE)

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const fetchCallback = async () => {
    const { quoteData, assembledData } = await quoteAndAssemble(
      inputCurrency,
      outputCurrency,
      typedValue,
      allowedSlippage,
      account,
    )
    setAssembledTransaction(assembledData)
    setQuoteData(quoteData)
  }

  const [onPresentConfirmModal] = useModalRefetch(
    <ConfirmSwapModal
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={sendTransaction}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      assembledTransaction={assembledTransaction}
      swapData={quoteData}
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      formattedAmounts={formattedAmounts}
      loadingConfirm={loadingConfirm}
    />,
    true,
    true,
    'confirmSwapModal',
    fetchCallback,
  )

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  // const isChartSupported = useMemo(() => CHART_SUPPORT_CHAIN_IDS.includes(chainId), [chainId])
  const isChartSupported = false

  return (
    <>
      <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
        <PageHeader>
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <WelcomeTypeIt
                options={{
                  cursorChar: ' ',
                  cursorSpeed: 1000000,
                  speed: 75,
                }}
                speed={10}
                getBeforeInit={(instance) => {
                  instance.type('SWAP', { speed: 5000 })
                  return instance
                }}
              ></WelcomeTypeIt>
            </Flex>
          </Flex>
          {/* <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="backgroundAlt" mb="4px">
              {t('Swap')}
            </Heading>
          </Flex>
        </Flex> */}
        </PageHeader>
        <TabsComponent />
        {view === SwapType.CROSS_CHAIN_SWAP && (
          <Flex width="100%" justifyContent="center" position="relative" marginBottom="100px">
            <CrossChainSwap />
          </Flex>
        )}
        {view === SwapType.REGULAR_SWAP && (
          <Flex
            width="100%"
            minWidth="100%"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            position="relative"
            marginLeft="auto"
            marginRight="auto"
          >
            {!isMobile && isChartSupported && (
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
              />
            )}
            {isChartSupported && (
              <BottomDrawer
                content={
                  <PriceChartContainer
                    inputCurrencyId={inputCurrencyId}
                    inputCurrency={currencies[Field.INPUT]}
                    outputCurrencyId={outputCurrencyId}
                    outputCurrency={currencies[Field.OUTPUT]}
                    isChartExpanded={isChartExpanded}
                    setIsChartExpanded={setIsChartExpanded}
                    isChartDisplayed={isChartDisplayed}
                    currentSwapPrice={singleTokenPrice}
                    isMobile
                  />
                }
                isOpen={isChartDisplayed}
                setIsOpen={setIsChartDisplayed}
              />
            )}
            <Flex
              flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}
              style={{ width: '100%', marginBottom: '40px' }}
            >
              <StyledSwapContainer
                className="animate__animated animate__fadeInLeft"
                $isChartExpanded={isChartExpanded}
                style={{ margin: 'auto' }}
              >
                <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
                  <AppBody marginTop="0rem">
                    <CurrencyInputHeader
                      title={t('')}
                      subtitle={t('')}
                      setIsChartDisplayed={setIsChartDisplayed}
                      isChartDisplayed={isChartDisplayed}
                      hasAmount={hasAmount}
                      onRefreshPrice={onRefreshPrice}
                    />
                    <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
                      <AutoColumn gap="sm">
                        <CurrencyInputPanel
                          label={independentField === Field.OUTPUT && !showWrap ? t('From (estimated)') : t('From')}
                          value={formattedAmounts[Field.INPUT]}
                          showMaxButton={!atMaxAmountInput}
                          currency={currencies[Field.INPUT]}
                          onUserInput={handleTypeInput}
                          onMax={handleMaxInput}
                          onCurrencySelect={handleInputSelect}
                          otherCurrency={currencies[Field.OUTPUT]}
                          id="swap-currency-input"
                        />

                        <AutoColumn gap="sm" justify="space-between">
                          <AutoRow gap="sm" justify="center" style={{ padding: '0 0rem' }}>
                            <SwitchIconButton
                              variant="light"
                              size="40px"
                              onClick={() => {
                                setApprovalSubmitted(false) // reset 2 step UI for approvals
                                onSwitchTokens()
                              }}
                            >
                              <ArrowDownIcon
                                className="icon-down"
                                color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'text' : 'text'}
                              />
                              <ArrowUpDownIcon
                                className="icon-up-down"
                                color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'text' : 'text'}
                              />
                            </SwitchIconButton>
                          </AutoRow>
                        </AutoColumn>
                        <CurrencyInputPanel
                          value={formattedAmounts[Field.OUTPUT]}
                          onUserInput={handleTypeOutput}
                          label={
                            independentField === Field.INPUT && !showWrap && swapData ? t('To (estimated)') : t('To')
                          }
                          showMaxButton={false}
                          currency={currencies[Field.OUTPUT]}
                          onCurrencySelect={handleOutputSelect}
                          loading={swapData.isLoading}
                          otherCurrency={currencies[Field.INPUT]}
                          id="swap-currency-output"
                          disabled
                        />

                        {showWrap ? null : (
                          <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
                            <RowBetween align="center">
                              {swapData.data && (
                                <>
                                  <Flex justifyContent="flex-start" alignItems="center">
                                    <Label>{t('Rate')}</Label>
                                    <QuestionHelper
                                      text={t('Estimated effective rate for this route')}
                                      ml="4px"
                                      placement="top-start"
                                    />
                                  </Flex>
                                  {isLoading ? (
                                    <Skeleton width="100%" ml="8px" height="24px" />
                                  ) : (
                                    // <TradePrice
                                    //   price={trade?.executionPrice}
                                    //   showInverted={showInverted}
                                    //   setShowInverted={setShowInverted}
                                    // />
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
                                      {inputAmount &&
                                        outputAmount &&
                                        inputCurrency &&
                                        outputCurrency &&
                                        formatExecutionPriceOdos(
                                          inputAmount,
                                          outputAmount,
                                          inputCurrency,
                                          outputCurrency,
                                          showInverted,
                                        )}
                                      <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                                        <AutoRenewIcon width="14px" />
                                      </StyledBalanceMaxMini>
                                    </Text>
                                  )}
                                </>
                              )}
                            </RowBetween>
                            <RowBetween align="center">
                              {swapData.data && (
                                <>
                                  <Flex justifyContent="flex-start" alignItems="center">
                                    <Label>{t('Minimum Received')}</Label>
                                    <QuestionHelper
                                      text={t(
                                        'The transaction will revert if there is large unfavorable price slippage before transaction execution (slippage limit configurable in settings)',
                                      )}
                                      ml="4px"
                                      placement="top-start"
                                    />
                                  </Flex>
                                  {isLoading ? (
                                    <Skeleton width="100%" ml="8px" height="24px" />
                                  ) : (
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
                                      {(
                                        parseFloat(formattedAmounts[Field.OUTPUT]) *
                                        (1 - allowedSlippage / 10000)
                                      ).toFixed(4)}{' '}
                                      {outputCurrency.symbol}
                                    </Text>
                                  )}
                                </>
                              )}
                            </RowBetween>
                            <RowBetween align="center">
                              {swapData.data && (
                                <>
                                  <Flex justifyContent="flex-start" alignItems="center">
                                    <Label>{t('Gas Price')}</Label>
                                    <QuestionHelper
                                      text={t('Estimated gas paid to the miner to execute the route')}
                                      ml="4px"
                                      placement="top-start"
                                    />
                                  </Flex>

                                  {isLoading ? (
                                    <Skeleton width="100%" ml="8px" height="24px" />
                                  ) : (
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
                                      ~{swapData.data.gasEstimate} (~${swapData.data.gasEstimateValue.toFixed(2)})
                                    </Text>
                                  )}
                                </>
                              )}
                            </RowBetween>
                          </AutoColumn>
                        )}
                      </AutoColumn>
                      <Box mt="0.25rem">
                        {swapIsUnsupported ? (
                          <Button style={{ backgroundColor: '#333', borderWidth: '2px' }} width="100%" disabled>
                            <Text color="#fff"> NOPE. That's a scam. You're welcome. </Text>
                          </Button>
                        ) : !account ? (
                          <ConnectWalletButton width="100%" />
                        ) : showWrap ? (
                          <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                            {wrapInputError ??
                              (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                          </Button>
                        ) : !swapData && userHasSpecifiedInputOutput ? (
                          // noRoute && userHasSpecifiedInputOutput ? (
                          <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
                            <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
                          </GreyCard>
                        ) : showApproveFlow ? (
                          <RowBetween>
                            <Button
                              variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                              onClick={approveCallback}
                              disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                              width="48%"
                            >
                              {approval === ApprovalState.PENDING ? (
                                <AutoRow gap="6px" justify="center">
                                  {t('Enabling')} <CircleLoader stroke="white" />
                                </AutoRow>
                              ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                                t('Enabled')
                              ) : (
                                t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                              )}
                            </Button>
                            <Button
                              variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                              onClick={async () => {
                                setSwapState({
                                  attemptingTxn: false,
                                  swapErrorMessage: undefined,
                                  txHash: undefined,
                                })
                                setLoadingConfirm(true)
                                onPresentConfirmModal()
                                const { quoteData, assembledData } = await quoteAndAssemble(
                                  inputCurrency,
                                  outputCurrency,
                                  typedValue,
                                  allowedSlippage,
                                  account,
                                )
                                setAssembledTransaction(assembledData)
                                setQuoteData(quoteData)
                                setLoadingConfirm(false)
                              }}
                              width="48%"
                              id="swap-button"
                              disabled={!isValid || approval !== ApprovalState.APPROVED || priceImpactSeverity > 3}
                            >
                              {priceImpactSeverity > 3
                                ? t('Price Impact High')
                                : priceImpactSeverity > 2
                                ? t('Swap Anyway')
                                : t('Swap')}
                            </Button>
                          </RowBetween>
                        ) : (
                          <Button
                            variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                            onClick={async () => {
                              setSwapState({
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              setLoadingConfirm(true)
                              onPresentConfirmModal()
                              const { quoteData, assembledData } = await quoteAndAssemble(
                                inputCurrency,
                                outputCurrency,
                                typedValue,
                                allowedSlippage,
                                account,
                              )
                              setAssembledTransaction(assembledData)
                              setQuoteData(quoteData)
                              setLoadingConfirm(false)
                            }}
                            id="swap-button"
                            width="100%"
                            disabled={!isValid || priceImpactSeverity > 3}
                          >
                            {swapInputError ||
                              (priceImpactSeverity > 3
                                ? t('Price Impact Too High')
                                : priceImpactSeverity > 2
                                ? t('Swap Anyway')
                                : t('Swap'))}
                          </Button>
                        )}
                        {showApproveFlow && (
                          <Column style={{ marginTop: '1rem' }}>
                            <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                          </Column>
                        )}
                        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                      </Box>
                      <Flex justifyContent="center" alignItems="center" style={{ marginTop: 24 }}>
                        <div style={{ color: '#fff', fontSize: 12 }}>Powered By</div>
                        <img
                          src="/images/decorations/Odos_logo_white_transparent.png"
                          alt="powered by odos"
                          style={{ height: '60px', width: 'auto' }}
                        />
                      </Flex>
                    </Wrapper>
                  </AppBody>
                  {/* CAN ADD THIS BACK LATER */}
                  {/* {!swapIsUnsupported ? (
                    trade && <AdvancedSwapDetailsDropdown trade={trade} />
                  ) : ( */}
                  {swapIsUnsupported && (
                    <UnsupportedCurrencyFooter
                      currencies={[currencies.INPUT, currencies.OUTPUT]}
                      show={swapIsUnsupported}
                    />
                  )}
                  {/* )} */}
                </StyledInputCurrencyWrapper>
              </StyledSwapContainer>
              {showRoute && (
                <AppBodySwap>
                  <Box>
                    <Flex flexDirection="column" alignItems="flex-start" width="100%" padding="4px" mr={18}>
                      <Heading as="h2">Swap Route</Heading>
                    </Flex>
                    <div style={{ margin: 20 }}>
                      {swapData?.data?.pathVizImage ? (
                        <img src={swapData.data.pathVizImage} alt="swap-path" />
                      ) : (
                        <div>Enter your swap to see the optimal route</div>
                      )}
                    </div>
                  </Box>
                </AppBodySwap>
              )}
              {isChartExpanded && (
                <Box display={['none', null, null, 'block']} width="100%" height="100%">
                  <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
                </Box>
              )}
            </Flex>
          </Flex>
        )}
        {view === SwapType.TWAP && <TWAP isChartExpanded={isChartExpanded} />}
        {view === SwapType.LIMIT && <TWAP limit isChartExpanded={isChartExpanded} />}
      </Page>
    </>
  )
}

const StyledContainer = styled.div`
  margin: auto;
  min-width: 300px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 450px;
    max-width: 100%;
  }
`

const CrossChainSwap = () => {
  const widgetConfig = {
    integratorId: 'squid-swap-widget',
    companyName: 'BaseSwap',
    style: {
      neutralContent: '#FFF',
      baseContent: '#FFF',
      base100: '#111',
      base200: '#333',
      base300: '#111',
      error: '#ED6A5E',
      warning: '#FFB155',
      success: '#004be4',
      primary: '#0154FE',
      secondary: '#1a65fe',
      secondaryContent: '#FFF',
      neutral: '#111',
      roundedBtn: '4px',
      roundedCornerBtn: '999px',
      roundedBox: '4px',
      roundedDropDown: '4px',
    },
    slippage: 1.5,
    infiniteApproval: false,
    enableExpress: true,
    apiUrl: 'https://api.squidrouter.com',
    comingSoonChainIds: ['cosmoshub-4', 'injective-1', 'kichain-2'],
    titles: {
      swap: 'Swap',
      settings: 'Settings',
      wallets: 'Wallets',
      tokens: 'Select Token',
      chains: 'Select Chain',
      history: 'History',
      transaction: 'Transaction',
      allTokens: 'Select Token',
      destination: 'Destination address',
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
  }

  const widgetUrl = `https://widget.squidrouter.com/iframe?config=${encodeURIComponent(JSON.stringify(widgetConfig))}`

  return (
    <StyledContainer>
      {/* 
              // @ts-ignore  */}
      <iframe
        src={widgetUrl}
        title="Swap Widget"
        width="100%"
        height="690px" // Adjust the height as needed
        frameBorder="0"
        scrolling="no"
        style={{
          border: '3px solid #fff',
          borderRadius: '12px',
        }}
      />
    </StyledContainer>
  )
}

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
  :focus {
    background-color: ${({ theme }) => theme.colors.dropdown};
    outline: none;
  }
`
