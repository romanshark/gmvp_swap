import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, Token, Trade } from '@magikswap/sdk'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import {
  Button,
  ButtonMenu,
  ButtonMenuItem,
  // Heading,
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
  // Card,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import PageHeader from 'components/PageHeader'
import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
  useSingleTokenSwapInfo,
} from '../../state/swap/hooks'
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  // useExchangeChartManager,
} from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
// import { SchemaMetaFieldDef } from 'graphql'
import TypeIt from 'typeit-react'
import 'animate.css'

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
  background-color: ${({ theme }) => theme.colors.primary};

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
        <ButtonMenuItem style={{ height: 40 }}>{t('BaseSwap')}</ButtonMenuItem>
        <ButtonMenuItem style={{ height: 40 }}>{t('Cross Chain Swap')}</ButtonMenuItem>
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

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

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
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
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
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }

    if (!swapCallback) {
      return
    }

    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })

    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

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
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

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

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
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
              />
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
          <Flex width="100%" justifyContent="center" position="relative">
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
            <Flex flexDirection="column">
              <StyledSwapContainer
                className="animate__animated animate__fadeInLeft animate__fast"
                $isChartExpanded={isChartExpanded}
              >
                <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
                  <AppBody>
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
                          label={
                            independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                          }
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
                          <AutoRow
                            gap="sm"
                            justify={isExpertMode ? 'space-between' : 'center'}
                            style={{ padding: '0 0rem' }}
                          >
                            <SwitchIconButton
                              variant="light"
                              size="40px"
                              style={{ border: '2px solid white' }}
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
                            {recipient === null && !showWrap && isExpertMode ? (
                              <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                                {t('+ Add a send (optional)')}
                              </Button>
                            ) : null}
                          </AutoRow>
                        </AutoColumn>
                        <CurrencyInputPanel
                          value={formattedAmounts[Field.OUTPUT]}
                          onUserInput={handleTypeOutput}
                          label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                          showMaxButton={false}
                          currency={currencies[Field.OUTPUT]}
                          onCurrencySelect={handleOutputSelect}
                          otherCurrency={currencies[Field.INPUT]}
                          id="swap-currency-output"
                        />

                        {isExpertMode && recipient !== null && !showWrap ? (
                          <>
                            <AutoRow justify="space-between" style={{ padding: '0rem' }}>
                              <ArrowWrapper clickable={false}>
                                <ArrowDownIcon width="24px" />
                              </ArrowWrapper>
                              <Button
                                variant="text"
                                id="remove-recipient-button"
                                onClick={() => onChangeRecipient(null)}
                              >
                                {t('- Remove send')}
                              </Button>
                            </AutoRow>
                            <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                          </>
                        ) : null}

                        {showWrap ? null : (
                          <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
                            <RowBetween align="center">
                              {Boolean(trade) && (
                                <>
                                  <Label>{t('Price')}</Label>
                                  {isLoading ? (
                                    <Skeleton width="100%" ml="8px" height="24px" />
                                  ) : (
                                    <TradePrice
                                      price={trade?.executionPrice}
                                      showInverted={showInverted}
                                      setShowInverted={setShowInverted}
                                    />
                                  )}
                                </>
                              )}
                            </RowBetween>
                            {/* <RowBetween align="center">
                          <Label>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary">
                            {allowedSlippage / 100}%
                          </Text>
                        </RowBetween> */}
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
                        ) : noRoute && userHasSpecifiedInputOutput ? (
                          <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
                            <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
                            {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
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
                                t('ENABLE')
                              ) : (
                                t('ENABLE %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                              )}
                            </Button>
                            <Button
                              variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                              onClick={() => {
                                if (isExpertMode) {
                                  handleSwap()
                                } else {
                                  setSwapState({
                                    tradeToConfirm: trade,
                                    attemptingTxn: false,
                                    swapErrorMessage: undefined,
                                    txHash: undefined,
                                  })
                                  onPresentConfirmModal()
                                }
                              }}
                              width="48%"
                              id="swap-button"
                              disabled={
                                !isValid ||
                                approval !== ApprovalState.APPROVED ||
                                (priceImpactSeverity > 3 && !isExpertMode)
                              }
                            >
                              {priceImpactSeverity > 3 && !isExpertMode
                                ? t('Price Impact High')
                                : priceImpactSeverity > 2
                                ? t('Swap Anyway')
                                : t('Swap')}
                            </Button>
                          </RowBetween>
                        ) : (
                          <Button
                            variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                            onClick={() => {
                              if (isExpertMode) {
                                handleSwap()
                              } else {
                                setSwapState({
                                  tradeToConfirm: trade,
                                  attemptingTxn: false,
                                  swapErrorMessage: undefined,
                                  txHash: undefined,
                                })
                                onPresentConfirmModal()
                              }
                            }}
                            id="swap-button"
                            width="100%"
                            disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                          >
                            {swapInputError ||
                              (priceImpactSeverity > 3 && !isExpertMode
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
                        {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                      </Box>
                    </Wrapper>
                  </AppBody>

                  {trade && <AdvancedSwapDetailsDropdown trade={trade} />}

                  <UnsupportedCurrencyFooter
                    currencies={[currencies.INPUT, currencies.OUTPUT]}
                    show={swapIsUnsupported}
                  />
                </StyledInputCurrencyWrapper>
              </StyledSwapContainer>
              {isChartExpanded && (
                <Box display={['none', null, null, 'block']} width="100%" height="100%">
                  <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
                </Box>
              )}
            </Flex>
          </Flex>
        )}
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
