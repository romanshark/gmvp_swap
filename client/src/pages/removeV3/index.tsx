import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount, Percent } from '@baseswapfi/sdk-core'
import { NonfungiblePositionManager } from '@baseswapfi/v3-sdk2'
import RangeBadge from 'components/Badge/RangeBadge'
import { Button, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Break } from 'components/earn/styled'
import FormattedCurrencyAmount from 'components/FormattedCurrencyAmount'
import Loader from 'components/Icons/LoadingSpinner'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import Slider from 'components/Slider'
import Toggle from 'components/Toggle'
import { isSupportedChain } from 'config/constants/chains'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { PositionPageUnsupportedContent } from 'pages/positions/PositionPage'
import { useCallback, useMemo, useState } from 'react'
import { useBurnV3ActionHandlers, useBurnV3State, useDerivedV3BurnInfo } from 'state/burn/v3/hooks'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import { useUserSlippageToleranceWithDefault } from 'state/user/v3/hooks'
import { useTheme } from 'styled-components'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { WRAPPED_NATIVE_CURRENCY } from 'config/constants/tokens-v3'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { currencyId } from '../../utils/currencyId'
import { ResponsiveHeaderText, SmallMaxButton, Wrapper } from './styled'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { TransactionType } from 'state/transactions/types'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import Page from 'views/Page'

const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

// redirect invalid tokenIds
export default function RemoveLiquidityV3() {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const tokenId = router.query.tokenId
  // const { tokenId } = useParams<{ tokenId: string }>()
  // const location = useLocation()

  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  if (parsedTokenId === null || parsedTokenId.eq(0)) {
    router.replace({
      pathname: `/positions`,
    })
    // return <Navigate to={{ ...location, pathname: '/pools' }} replace />
  }

  if (isSupportedChain(chainId)) {
    return <Remove tokenId={parsedTokenId} />
  }

  return <PositionPageUnsupportedContent />
}

function Remove({ tokenId }: { tokenId: BigNumber }) {
  const { position } = useV3PositionFromTokenId(tokenId)
  const theme = useTheme()
  const { account, chainId, library: provider } = useActiveWeb3React()
  const { t } = useTranslation()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  // burn state
  const { percent } = useBurnV3State()
  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useDerivedV3BurnInfo(position, receiveWETH)
  const { onPercentSelect } = useBurnV3ActionHandlers()

  const removed = position?.liquidity?.eq(0)

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const deadline = useTransactionDeadline() // custom from users settings
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract(chainId)

  const burn = useCallback(async () => {
    setAttemptingTxn(true)
    if (
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !deadline ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !provider
    ) {
      return
    }

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account,
      },
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

    provider
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            setTxnHash(response.hash)
            setAttemptingTxn(false)
            addTransaction(response, {
              type: TransactionType.REMOVE_LIQUIDITY_V3,
              baseCurrencyId: currencyId(liquidityValue0.currency),
              quoteCurrencyId: currencyId(liquidityValue1.currency),
              expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
              expectedAmountQuoteRaw: liquidityValue1.quotient.toString(),
            })
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [
    positionManager,
    liquidityValue0,
    liquidityValue1,
    deadline,
    account,
    chainId,
    feeValue0,
    feeValue1,
    positionSDK,
    liquidityPercentage,
    provider,
    tokenId,
    allowedSlippage,
    addTransaction,
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onPercentSelectForSlider(0)
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, txnHash])

  function modalHeader() {
    return (
      <AutoColumn gap="sm" style={{ padding: '16px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={500}>
            {t(`Pooled ${liquidityValue0?.currency?.symbol}:`)}
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue0?.currency} />
          </RowFixed>
        </RowBetween>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={500}>
            {t(`Pooled ${liquidityValue1?.currency?.symbol}:`)}
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue1?.currency} />
          </RowFixed>
        </RowBetween>
        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
          <>
            <Text fontSize={12} color={theme.colors.text} textAlign="left" padding="8px 0 0 0">
              <Trans>You will also collect fees earned from this position.</Trans>
            </Text>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {t(`${feeValue0?.currency?.symbol} Fees Earned:`)}
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue0?.currency} />
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {t(`${feeValue1?.currency?.symbol} Fees Earned:`)}
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue1?.currency} />
              </RowFixed>
            </RowBetween>
          </>
        ) : null}
        <Button mt="16px" onClick={burn}>
          <Trans>Remove</Trans>
        </Button>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped)),
  )
  return (
    <AutoColumn>
      {showConfirm && (
        <TransactionConfirmationModal
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txnHash ?? ''}
          title={t('Remove Liquidity')}
          pendingText={t(
            `Removing ${liquidityValue0?.toSignificant(6)} ${
              liquidityValue0?.currency?.symbol
            } and ${liquidityValue1?.toSignificant(6)} ${liquidityValue1?.currency?.symbol}`,
          )}
          // @ts-ignore
          content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={() => null} />}
        />
      )}

      {!showConfirm && (
        <Page>
          <AddRemoveTabs
            creating={false}
            adding={false}
            positionID={tokenId?.toString()}
            autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE}
          />
          <Wrapper>
            {position ? (
              <AutoColumn gap="lg">
                <RowBetween mb="12px">
                  <RowFixed>
                    <DoubleCurrencyLogo
                      currency0={feeValue0?.currency}
                      currency1={feeValue1?.currency}
                      size={60}
                      margin
                    />
                    <Text
                      ml="10px"
                      fontSize="32px"
                    >{`${feeValue0?.currency?.symbol}/${feeValue1?.currency?.symbol}`}</Text>
                  </RowFixed>
                  <RangeBadge removed={removed} inRange={!outOfRange} />
                </RowBetween>
                <LightCard mb="12px">
                  <AutoColumn gap="md">
                    <Text fontWeight={400}>
                      <Trans>Amount</Trans>
                    </Text>
                    <RowBetween>
                      <ResponsiveHeaderText>{t(`${percentForSlider}%`)}</ResponsiveHeaderText>
                      <AutoRow gap="4px" justify="flex-end">
                        <SmallMaxButton onClick={() => onPercentSelect(25)} width="20%">
                          <Trans>25%</Trans>
                        </SmallMaxButton>
                        <SmallMaxButton onClick={() => onPercentSelect(50)} width="20%">
                          <Trans>50%</Trans>
                        </SmallMaxButton>
                        <SmallMaxButton onClick={() => onPercentSelect(75)} width="20%">
                          <Trans>75%</Trans>
                        </SmallMaxButton>
                        <SmallMaxButton onClick={() => onPercentSelect(100)} width="20%">
                          <Trans>Max</Trans>
                        </SmallMaxButton>
                      </AutoRow>
                    </RowBetween>
                    <Slider value={percentForSlider} onChange={onPercentSelectForSlider} />
                  </AutoColumn>
                </LightCard>
                <LightCard mb="12px">
                  <AutoColumn gap="md">
                    <RowBetween style={{marginBottom: '4px' }}>
                      <Text  textTransform="uppercase" fontSize={16} fontWeight={500}>
                        {t(`Pooled ${liquidityValue0?.currency?.symbol}:`)}
                      </Text>
                      <RowFixed>
                        <Text  fontSize={16} fontWeight={500} marginLeft="6px">
                          {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
                        </Text>
                        <CurrencyLogo size="30px" style={{ marginLeft: '8px' }} currency={liquidityValue0?.currency} />
                      </RowFixed>
                    </RowBetween>
                    <RowBetween style={{marginBottom: '1rem' }}>
                      <Text textTransform="uppercase" fontSize={16} fontWeight={500}>
                        {t(`Pooled ${liquidityValue1?.currency?.symbol}:`)}
                      </Text>
                      <RowFixed>
                        <Text fontSize={16} fontWeight={500} marginLeft="6px">
                          {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
                        </Text>
                        <CurrencyLogo size="30px" style={{ marginLeft: '8px' }} currency={liquidityValue1?.currency} />
                      </RowFixed>
                    </RowBetween>
                    {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
                      <>
                        <Break />
                        <RowBetween>
                          <Text fontSize={16} textTransform="uppercase" fontWeight={500}>
                            {t(`${feeValue0?.currency?.symbol} Fees Earned:`)}
                          </Text>
                          <RowFixed>
                            <Text fontSize={16} fontWeight={500} marginLeft="6px">
                              {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                            </Text>
                            <CurrencyLogo size="30px" style={{ marginLeft: '8px' }} currency={feeValue0?.currency} />
                          </RowFixed>
                        </RowBetween>
                        <RowBetween style={{ marginTop: '8px' }}>
                          <Text textTransform="uppercase" fontSize={16} fontWeight={500}>
                            {t(`${feeValue1?.currency?.symbol} Fees Earned:`)}
                          </Text>
                          <RowFixed>
                            <Text fontSize={16} fontWeight={500} marginLeft="6px">
                              {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                            </Text>
                            <CurrencyLogo size="30px" style={{ marginLeft: '8px' }} currency={feeValue1?.currency} />
                          </RowFixed>
                        </RowBetween>
                      </>
                    ) : null}
                  </AutoColumn>
                </LightCard>

                {showCollectAsWeth && (
                  <RowBetween style={{ marginBottom: '1rem' }}>
                    <Text>{t(`Collect as ${nativeWrappedSymbol}`)}</Text>
                    <Toggle
                      id="receive-as-weth"
                      isActive={receiveWETH}
                      toggle={() => setReceiveWETH((receive) => !receive)}
                    />
                  </RowBetween>
                )}

                <div style={{ display: 'flex' }}>
                  <AutoColumn gap="md" style={{ flex: '1' }}>
                    <Button
                      // confirmed={false}
                      disabled={removed || percent === 0 || !liquidityValue0}
                      onClick={() => setShowConfirm(true)}
                    >
                      {removed ? <Trans>Closed</Trans> : error ?? <Trans>Remove</Trans>}
                    </Button>
                  </AutoColumn>
                </div>
              </AutoColumn>
            ) : (
              <Loader />
            )}
          </Wrapper>
        </Page>
      )}
    </AutoColumn>
  )
}
