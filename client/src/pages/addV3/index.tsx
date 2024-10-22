import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, Percent } from '@baseswapfi/sdk-core'
import { FeeAmount, NonfungiblePositionManager } from '@baseswapfi/v3-sdk2'
import OwnershipWarning from 'components/AddLiquidity/OwnershipWarning'
import usePrevious from 'hooks/usePrevious'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { TbKarate } from 'react-icons/tb'
import {
  useV3MintActionHandlers,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
  useV3MintState,
} from 'state/mint/v3/hooks'
import styled, { useTheme } from 'styled-components'

import { Button, Card, Flex, Text } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { Bound, Field } from 'state/mint/v3/actions'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import { TransactionType } from 'state/transactions/types'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { currencyId } from 'utils/v3/currencyId'
import { maxAmountSpend } from 'utils/v3/maxAmountSpend'
import MediumOnly, { CurrencyDropdown, DynamicSection, ResponsiveTwoColumns, StyledInput, Wrapper } from './styled'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useCurrency } from 'hooks/v3/Tokens'
import { useRouter } from 'next/router'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useStablecoinValue } from 'hooks/useStablecoinPrice'
import { useApproveCallback } from 'hooks/v3/useApproveCallback'
import { useUserSlippageToleranceWithDefault } from 'state/user/v3/hooks'
import { ZERO_PERCENT_V3 } from 'config/constants/v3'
import { WRAPPED_NATIVE_CURRENCY } from 'config/constants/tokens-v3'
import { useIsSwapUnsupported } from 'hooks/v3/useIsSwapUnsupported'
import { ApprovalState } from 'lib/hooks/useApproval'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import { Dots } from 'pages/positions/styled'
import ConnectWalletButton from 'components/ConnectWalletButton'
import AppBody, { BodyWrapper } from 'components/App/AppBody'
import AddV3Body, { AddV3Wrapper } from 'components/App/AppBodyV3'
import Review from './Review'
import { AddRemoveTabs } from 'components/NavigationTabs'
import FeeSelector from 'components/FeeSelector'
import Page from 'views/Page'
import { AppHeader } from 'components/App'
import { PositionPreview } from 'components/PositionPreview'
import HoverInlineText from 'components/HoverInlineText'
import RateToggle from 'components/RateToggle'
import PresetsButtons from 'components/RangeSelector/PresetsButtons'
import RangeSelector from 'components/RangeSelector'
import LiquidityChartRangeInput from 'components/LiquidityChartRangeInput'
import CurrencyInputPanelV3 from 'components/CurrencyInputPanelV3'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { isSupportedChain } from 'config/constants/chains'
import { PositionPageUnsupportedContent } from 'pages/positions/PositionPage'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'

const Body = styled(AddV3Body)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  padding: 0rem;
  width: 100%;
`

const PageTitle = styled(Text)`
  font-weight: 400;
  color: #fff;
  text-align: center;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 48px;
  }
`

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const StyledBodyWrapper = styled(BodyWrapper)<{ $hasExistingPosition: boolean }>`
  padding: ${({ $hasExistingPosition }) => ($hasExistingPosition ? '0px' : 0)};
  max-width: 640px;
`

export default function RedirectDuplicateTokenIds() {
  const router = useRouter()
  const params: {
    currencyIdA?: string
    currencyIdB?: string
    feeAmount?: string
    tokenId?: string
  } = router.query
  const currencyIdA = params?.currencyIdA
  const currencyIdB = params?.currencyIdB

  const { chainId } = useActiveWeb3React()

  // prevent weth + eth
  const isETHOrWETHA =
    currencyIdA === 'ETH' || (chainId !== undefined && currencyIdA === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
  const isETHOrWETHB =
    currencyIdB === 'ETH' || (chainId !== undefined && currencyIdB === WRAPPED_NATIVE_CURRENCY[chainId]?.address)

  if (
    currencyIdA &&
    currencyIdB &&
    (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
  ) {
    // return <Navigate to={`/add/${currencyIdA}`} replace />

    router.replace({
      pathname: 'addV3',
      query: {
        currencyIdA,
      },
    })
  }
  return <AddLiquidityWrapper />
}

export function AddLiquidityWrapper() {
  const { chainId } = useActiveWeb3React()
  if (isSupportedChain(chainId)) {
    return <AddLiquidity />
  } else {
    return <PositionPageUnsupportedContent />
  }
}

function AddLiquidity() {
  const { t } = useTranslation()
  const router = useRouter()

  const params: {
    currencyIdA?: string
    currencyIdB?: string
    feeAmount?: string
    tokenId?: string
  } = router.query

  const { account, chainId, library: provider } = useActiveWeb3React()
  const theme = useTheme()

  const currencyIdA = params?.currencyIdA
  const currencyIdB = params?.currencyIdB

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract(chainId)

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // fee selection from url
  const feeAmountFromUrl = params?.feeAmount
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined

  // check for existing position if tokenId in url
  const tokenId = params?.tokenId
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined,
  )

  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
  )

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useStablecoinValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useStablecoinValue(parsedAmounts[Field.CURRENCY_B]),
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
  )

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT_V3 : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  )

  async function onAdd() {
    if (!chainId || !provider || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative,
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      let txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value,
      }

      setAttemptingTxn(true)

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
              setAttemptingTxn(false)
              addTransaction(response, {
                type: TransactionType.ADD_LIQUIDITY_V3_POOL,
                baseCurrencyId: currencyId(baseCurrency),
                quoteCurrencyId: currencyId(quoteCurrency),
                createPool: Boolean(noLiquidity),
                expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                feeAmount: position.pool.fee,
              })
              setTxHash(response.hash)
            })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent weth + eth
      const isETHOrWETHNew =
        currencyIdNew === 'ETH' ||
        (chainId !== undefined && currencyIdNew === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
      const isETHOrWETHOther =
        currencyIdOther !== undefined &&
        (currencyIdOther === 'ETH' ||
          (chainId !== undefined && currencyIdOther === WRAPPED_NATIVE_CURRENCY[chainId]?.address))

      if (isETHOrWETHNew && isETHOrWETHOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currencyIdA: idA,
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currencyIdA: idA,
              currencyIdB: idB,
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)

      if (idA === undefined) {
        router.replace(
          {
            pathname: `${router.pathname}`,
            query: {
              ...router.query,
              currencyIdB: [idB],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currencyIdA: idA,
              currencyIdB: idB,
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            currencyIdA: currencyIdA,
            currencyIdB: currencyIdB,
            feeAmount: newFeeAmount,
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    },
    [currencyIdA, currencyIdB, router, onLeftRangeInput, onRightRangeInput],
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      router.push('/positions')
    }
    setTxHash('')
  }, [router, onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    // navigate(`/add`)
    router.push('/addV3')
  }, [router, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  }`

  const [searchParams, setSearchParams] = useState<{ minPrice?: string; maxPrice?: string }>()
  const oldSearchParams = usePrevious(searchParams)

  const handleSetFullRange = useCallback(() => {
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) {
      // searchParams.set('minPrice', minPrice.toSignificant(5))
      setSearchParams({ minPrice: minPrice.toSignificant(5) })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            minPrice: minPrice.toSignificant(5),
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }

    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) {
      // searchParams.set('maxPrice', maxPrice.toSignificant(5))
      setSearchParams({ maxPrice: maxPrice.toSignificant(5) })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            maxPrice: maxPrice.toSignificant(5),
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }, [getSetFullRange, pricesAtLimit, searchParams, setSearchParams])

  // START: sync values with query string

  // use query string as an input to onInput handlers
  useEffect(() => {
    const minPrice = searchParams?.minPrice
    const oldMinPrice = oldSearchParams?.minPrice
    if (
      minPrice &&
      typeof minPrice === 'string' &&
      !Number.isNaN(minPrice as any) &&
      (!oldMinPrice || oldMinPrice !== minPrice)
    ) {
      onLeftRangeInput(minPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const maxPrice = searchParams?.maxPrice
    const oldMaxPrice = oldSearchParams?.maxPrice
    if (
      maxPrice &&
      typeof maxPrice === 'string' &&
      !Number.isNaN(maxPrice as any) &&
      (!oldMaxPrice || oldMaxPrice !== maxPrice)
    ) {
      onLeftRangeInput(maxPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const Buttons = () =>
    addIsUnsupported ? (
      <Button disabled padding="12px">
        <Text mb="4px">
          <Trans>Unsupported Asset</Trans>
        </Text>
      </Button>
    ) : !account ? (
      <ConnectWalletButton />
    ) : (
      <AutoColumn gap="md">
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween mb={3}>
              {showApprovalA && (
                <Button
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  width={showApprovalB ? '48%' : '100%'}
                >
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>
                      <Text>{t(`Approving ${currencies[Field.CURRENCY_A]?.symbol}`)}</Text>
                    </Dots>
                  ) : (
                    <Text>{t(`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)}</Text>
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  width={showApprovalA ? '48%' : '100%'}
                >
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>
                      <Text>{t(`Approving ${currencies[Field.CURRENCY_B]?.symbol}`)}</Text>
                    </Dots>
                  ) : (
                    <Text>{t(`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)}</Text>
                  )}
                </Button>
              )}
            </RowBetween>
          )}
        <Button
          marginBottom="1rem"
          onClick={() => {
            setShowConfirm(true)
          }}
          disabled={
            !isValid ||
            (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
          //error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
        >
          <Text fontWeight={500}>{errorMessage ? errorMessage : <Trans>Preview</Trans>}</Text>
        </Button>
      </AutoColumn>
    )

  const usdcValueCurrencyA = usdcValues[Field.CURRENCY_A]
  const usdcValueCurrencyB = usdcValues[Field.CURRENCY_B]
  const currencyAFiat = useMemo(
    () => ({
      data: usdcValueCurrencyA ? parseFloat(usdcValueCurrencyA.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyA],
  )
  const currencyBFiat = useMemo(
    () => ({
      data: usdcValueCurrencyB ? parseFloat(usdcValueCurrencyB.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyB],
  )

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT =
    addressesAreEquivalent(owner, account) || addressesAreEquivalent(existingPositionDetails?.operator, account)
  const showOwnershipWarning = Boolean(hasExistingPosition && account && !ownsNFT)

  return (
    <>
      <Page>
        <PageTitle>
          Add <span style={{ textShadow: '4px 0px 12px #0154FD, -4px 0px 12px #68B9FF' }}>BaseX</span> Liquidity
        </PageTitle>
        {showConfirm && (
          <TransactionConfirmationModal
            title={t('Add Liquidity')}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            pendingText={pendingText}
            // @ts-ignore
            content={() => {
              return (
                <ConfirmationModalContent
                  topContent={() => (
                    <Review
                      parsedAmounts={parsedAmounts}
                      position={position}
                      existingPosition={existingPosition}
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      outOfRange={outOfRange}
                      ticksAtLimit={ticksAtLimit}
                    />
                  )}
                  bottomContent={() => (
                    <Button style={{ marginTop: '1rem', width: '100%' }} onClick={onAdd}>
                      <Text fontWeight={500} fontSize={20}>
                        <Trans>Add</Trans>
                      </Text>
                    </Button>
                  )}
                />
              )
            }}
          />
        )}
        {!showConfirm && (
          <Body>
            <AppHeader title={t('Add Liquidity')} subtitle={t('')} />
            <AddRemoveTabs
              creating={false}
              adding={true}
              positionID={tokenId}
              autoSlippage={DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE}
              showBackLink={!hasExistingPosition}
            >
              {!hasExistingPosition && (
                <Flex justifyContent="flex-end" style={{ width: 'fit-content', minWidth: 'fit-content' }}>
                  <MediumOnly>
                    <Button onClick={clearAll}>
                      <Text fontSize="12px">
                        <Trans>Clear All</Trans>
                      </Text>
                    </Button>
                  </MediumOnly>
                </Flex>
              )}
            </AddRemoveTabs>
            <Wrapper>
              <ResponsiveTwoColumns wide={!hasExistingPosition}>
                <AutoColumn gap="sm">
                  {!hasExistingPosition && (
                    <>
                      <AutoColumn gap="md">
                        <Flex flexDirection="row" alignItems="center" justifyContent="center" marginBottom="12px">
                          <Text
                            textTransform="uppercase"
                            color="text"
                            fontWeight="400"
                            fontSize="1.2rem"
                            marginRight="4px"
                          >
                            {t('Choose your fighter')}
                          </Text>
                          <TbKarate width="36px" height="36px" style={{ color: '#0154FE' }} />
                        </Flex>
                        <RowBetween>
                          <CurrencyDropdown
                            value={formattedAmounts[Field.CURRENCY_A]}
                            onUserInput={onFieldAInput}
                            hideInput={true}
                            onMax={() => {
                              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                            }}
                            onCurrencySelect={handleCurrencyASelect}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                            currency={currencies[Field.CURRENCY_A] ?? null}
                            id="add-liquidity-input-tokena"
                            showCommonBases
                          />

                          <div style={{ width: '12px' }} />

                          <CurrencyDropdown
                            value={formattedAmounts[Field.CURRENCY_B]}
                            hideInput={true}
                            onUserInput={onFieldBInput}
                            onCurrencySelect={handleCurrencyBSelect}
                            onMax={() => {
                              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                            }}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                            currency={currencies[Field.CURRENCY_B] ?? null}
                            id="add-liquidity-input-tokenb"
                            showCommonBases
                          />
                        </RowBetween>

                        <FeeSelector
                          disabled={!quoteCurrency || !baseCurrency}
                          feeAmount={feeAmount}
                          handleFeePoolSelect={handleFeePoolSelect}
                          currencyA={baseCurrency ?? undefined}
                          currencyB={quoteCurrency ?? undefined}
                        />
                      </AutoColumn>{' '}
                    </>
                  )}
                  {hasExistingPosition && existingPosition && (
                    <PositionPreview
                      position={existingPosition}
                      title={<Trans>Selected Range</Trans>}
                      inRange={!outOfRange}
                      ticksAtLimit={ticksAtLimit}
                    />
                  )}
                </AutoColumn>

                {!hasExistingPosition && (
                  <>
                    <DynamicSection disabled={!feeAmount || invalidPool}>
                      <RowBetween mb={2}>
                        <Text>
                          <Trans>SET PRICE RANGE</Trans>
                        </Text>

                        {Boolean(baseCurrency && quoteCurrency) && (
                          <RowFixed gap="4px">
                            <PresetsButtons onSetFullRange={handleSetFullRange} />
                            <RateToggle
                              currencyA={baseCurrency as Currency}
                              currencyB={quoteCurrency as Currency}
                              handleRateToggle={() => {
                                if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                                  onLeftRangeInput(
                                    (invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? '',
                                  )
                                  onRightRangeInput(
                                    (invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? '',
                                  )
                                  onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
                                }

                                router.replace(
                                  {
                                    pathname: router.pathname,
                                    query: {
                                      ...router.query,
                                      currencyIdB: currencyIdB,
                                      currencyIdA: currencyIdA,
                                      feeAmount: feeAmount ? feeAmount.toString() : '',
                                    },
                                  },
                                  undefined,
                                  {
                                    shallow: true,
                                  },
                                )
                              }}
                            />
                          </RowFixed>
                        )}
                      </RowBetween>

                      <RangeSelector
                        priceLower={priceLower}
                        priceUpper={priceUpper}
                        getDecrementLower={getDecrementLower}
                        getIncrementLower={getIncrementLower}
                        getDecrementUpper={getDecrementUpper}
                        getIncrementUpper={getIncrementUpper}
                        onLeftRangeInput={onLeftRangeInput}
                        onRightRangeInput={onRightRangeInput}
                        currencyA={baseCurrency}
                        currencyB={quoteCurrency}
                        feeAmount={feeAmount}
                        ticksAtLimit={ticksAtLimit}
                      />

                      {outOfRange && (
                        <Card padding="8px 12px">
                          <Flex flexDirection="row">
                            <AlertTriangle stroke={theme.colors.primaryBright} size="16px" />
                            <Text ml="12px" fontSize="12px" textAlign="left">
                              <Trans>
                                Your position will not earn fees or be used in trades until the market price moves into
                                your range.
                              </Trans>
                            </Text>
                          </Flex>
                        </Card>
                      )}

                      {invalidRange && (
                        <Card padding="8px 12px">
                          <RowBetween>
                            <AlertTriangle stroke={theme.colors.primaryBright} size="16px" />
                            <Text ml="12px" fontSize="12px">
                              <Trans>Invalid range selected. The min price must be lower than the max price.</Trans>
                            </Text>
                          </RowBetween>
                        </Card>
                      )}
                    </DynamicSection>

                    <DynamicSection gap="md" disabled={!feeAmount || invalidPool}>
                      {!noLiquidity ? (
                        <>
                          {Boolean(price && baseCurrency && quoteCurrency && !noLiquidity) && (
                            <AutoColumn gap="2px" style={{ marginTop: '0.5rem' }}>
                              <Text fontWeight={500} fontSize={12}>
                                Current Price:
                              </Text>
                              <Text fontWeight={500} fontSize={20}>
                                {price && (
                                  <HoverInlineText
                                    maxCharacters={20}
                                    text={invertPrice ? price.invert().toSignificant(6) : price.toSignificant(6)}
                                  />
                                )}
                              </Text>
                              {baseCurrency && (
                                <Text fontSize={12}>
                                  {quoteCurrency?.symbol} per {baseCurrency.symbol}
                                </Text>
                              )}
                            </AutoColumn>
                          )}
                          <LiquidityChartRangeInput
                            currencyA={baseCurrency ?? undefined}
                            currencyB={quoteCurrency ?? undefined}
                            feeAmount={feeAmount}
                            ticksAtLimit={ticksAtLimit}
                            price={
                              price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined
                            }
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            interactive={!hasExistingPosition}
                          />
                        </>
                      ) : (
                        <AutoColumn gap="md">
                          {noLiquidity && (
                            <Card
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '1rem 1rem',
                              }}
                            >
                              <Text
                                fontSize={14}
                                style={{ fontWeight: 500 }}
                                textAlign="left"
                                color={theme.colors.warning}
                              >
                                <Trans>
                                  This pool must be initialized before you can add liquidity. To initialize, select a
                                  starting price for the pool. Then, enter your liquidity price range and deposit
                                  amount. Gas fees will be higher than usual due to the initialization transaction.
                                </Trans>
                              </Text>
                            </Card>
                          )}
                          <Card padding="12px" mt={2} mb={2}>
                            <StyledInput
                              className="start-price-input"
                              value={startPriceTypedValue}
                              onUserInput={onStartPriceInput}
                            />
                          </Card>
                          <RowBetween
                            style={{
                              backgroundColor: theme.colors.background,
                              padding: '12px',
                              borderRadius: '12px',
                            }}
                          >
                            <Text>{t(`Starting ${baseCurrency?.symbol} Price:`)}</Text>
                            <Text>
                              {price ? (
                                <RowFixed>
                                  <HoverInlineText
                                    maxCharacters={20}
                                    text={invertPrice ? price?.invert()?.toSignificant(8) : price?.toSignificant(8)}
                                  />{' '}
                                  <span style={{ marginLeft: '4px' }}>
                                    {quoteCurrency?.symbol} per {baseCurrency?.symbol}
                                  </span>
                                </RowFixed>
                              ) : (
                                '-'
                              )}
                            </Text>
                          </RowBetween>
                        </AutoColumn>
                      )}
                    </DynamicSection>
                  </>
                )}
                <div>
                  <DynamicSection disabled={invalidPool || invalidRange || (noLiquidity && !startPriceTypedValue)}>
                    <AutoColumn gap="md">
                      <Text>
                        {hasExistingPosition ? <Trans>Add more liquidity</Trans> : <Trans>Deposit Amounts</Trans>}
                      </Text>

                      <CurrencyInputPanelV3
                        value={formattedAmounts[Field.CURRENCY_A]}
                        onUserInput={onFieldAInput}
                        onMax={() => {
                          onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                        }}
                        showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                        currency={currencies[Field.CURRENCY_A] ?? null}
                        id="add-liquidity-input-tokena"
                        fiatValue={currencyAFiat}
                        showCommonBases
                        locked={depositADisabled}
                        disableCurrencySelect={true}
                      />

                      <CurrencyInputPanelV3
                        value={formattedAmounts[Field.CURRENCY_B]}
                        onUserInput={onFieldBInput}
                        onMax={() => {
                          onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                        }}
                        showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                        fiatValue={currencyBFiat}
                        currency={currencies[Field.CURRENCY_B] ?? null}
                        id="add-liquidity-input-tokenb"
                        showCommonBases
                        locked={depositBDisabled}
                        disableCurrencySelect={true}
                      />
                    </AutoColumn>
                  </DynamicSection>
                </div>
                <Buttons />
              </ResponsiveTwoColumns>
            </Wrapper>

            {showOwnershipWarning && <OwnershipWarning ownerAddress={owner} />}
            {addIsUnsupported && (
              <UnsupportedCurrencyFooter
                show={addIsUnsupported}
                currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
              />
            )}
          </Body>
        )}
      </Page>
    </>
  )
}
