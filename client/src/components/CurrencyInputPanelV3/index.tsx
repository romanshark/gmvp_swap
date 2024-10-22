import { Currency, CurrencyAmount, Token } from '@baseswapfi/sdk-core'
import { Pair } from '@baseswapfi/v2-sdk'
import {
  Button,
  ChevronDownIcon,
  Text,
  useModal,
  Flex,
  Box,
  useMatchBreakpoints,
  flexRowNoWrap,
  flexColumnNoWrap,
} from '@pancakeswap/uikit'
import styled, { css, useTheme } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'
import { RowBetween, RowFixed } from 'components/Row'
import { LoadingOpacityContainer, loadingOpacityMixin } from 'components/Loader/styled'
import { FiatValue } from './FiatValue'
import { formatCurrencyAmount } from 'utils/v3/formatCurrencyAmount'
import { ReactNode, useCallback, useState } from 'react'
import useCurrencyBalance from 'lib/hooks/useCurrencyBalance'
import { darken } from 'polished'
import { isSupportedChain } from 'config/constants/chains'
import Trans from 'components/Trans'

const CurrencySelect = styled(Button) <{
  visible: boolean
  selected: boolean
  hideInput?: boolean
  disabled?: boolean
  pointerEvents?: string
}>`
  align-items: center;
  background: ${({ theme }) => `${theme.colors.gradients.basedsexgrayflip} `};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  color: ${({ selected, theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: 8px;
  outline: none;
  user-select: none;
  border: none !important;
  font-size: 24px;
  font-weight: 500;
  height: ${({ hideInput }) => (hideInput ? '2.8rem' : '2.4rem')};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: 0 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => theme.colors.gradients.basedsexgrayflip};
  }
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  ${({ pointerEvents }) => pointerEvents && `pointer-events: none`}
`

const InputRow = styled.div<{ selected: boolean }>`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
  padding: ${({ selected }) => (selected ? ' 1rem 1rem 0.75rem 1rem' : '1rem 1rem 1rem 1rem')};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

// top part of input panel
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.2rem;
  padding: 0.75rem 1rem 0 1rem;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '12px' : '12px')};
  background-color: ${({ theme }) => theme.colors.gradients.basedsexgray};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
  margin-bottom: 8px;
  margin-top: 4px;

  }
`
const Container = styled.div<{ hideInput: boolean; disabled: boolean }>`
  border-radius: 8px; 
  border: 2px solid ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  ${({ theme, hideInput, disabled }) =>
    !disabled &&
    `
    :focus,
    :hover {
      transform: translateY(1px);
    }
  `}
`
const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 20px;
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  padding: 0px 1rem 0.75rem;
  height: 32px;
`

const StyledNumericalInput = styled(NumericalInput) <{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: any) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
  backgroundColor?: string
  borderRadius?: string
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  fiatValue?: { data?: number; isLoading: boolean }
  locked?: boolean
  loading?: boolean
}

export default function CurrencyInputPanelV3({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  borderRadius,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  disabled,
  error,
  showBUSD,
  backgroundColor,
  borderTopLeftRadius,
  borderTopRightRadius,
  fiatValue,
  renderBalance,
  hideInput = false,
  locked = false,
  loading = false,
  ...rest
}: CurrencyInputPanelProps) {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  // const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null

  const chainAllowed = isSupportedChain(chainId)

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <>
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      <Container hideInput={hideInput} disabled={!chainAllowed}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={!onCurrencySelect}>
          {!hideInput && (
            <StyledNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={onUserInput}
              disabled={!chainAllowed}
              $loading={loading}
            />
          )}

          <CurrencySelect
            disabled={!chainAllowed}
            visible={currency !== undefined}
            selected={!!currency}
            hideInput={hideInput}
            className="open-currency-select-button"
            onClick={() => {
              if (onCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
            pointerEvents={!onCurrencySelect ? 'none' : undefined}
          >
            <Aligner>
              <RowFixed>
                {pair ? (
                  <span style={{ marginRight: '0.5rem' }}>
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin />
                  </span>
                ) : (
                  currency && <CurrencyLogo style={{ marginRight: '0.5rem' }} currency={currency} size="48px" />
                )}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || <Trans>Select a token</Trans>}
                  </StyledTokenName>
                )}
              </RowFixed>
              {/* {onCurrencySelect && <StyledDropDown selected={!!currency} />} */}
              {!disableCurrencySelect && <ChevronDownIcon color="text" />}
            </Aligner>
          </CurrencySelect>
        </InputRow>

        {Boolean(!hideInput && !hideBalance && currency) && (
          <FiatRow>
            <RowBetween>
              <LoadingOpacityContainer $loading={loading}>
                {fiatValue && <FiatValue fiatValue={fiatValue} />}
              </LoadingOpacityContainer>
              {account && (
                <RowFixed style={{ height: '17px' }}>
                  {/* <Text
                    onClick={onMax}
                    color={theme.colors.tertiary}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {Boolean(!hideBalance && currency && selectedCurrencyBalance) &&
                      (renderBalance?.(selectedCurrencyBalance as CurrencyAmount<Currency>) || (
                        <Text>{t(`Balance: ${formatCurrencyAmount(selectedCurrencyBalance, 4)}`)}</Text>
                      ))}
                  </Text> */}
                  <Text
                    onClick={!disabled && onMax}
                    color="text"
                    fontSize='14px'
                    fontWeight="500"
                    letterSpacing="0px"
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {!hideBalance && !!currency
                      ? t('BALANCE: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                      : ' -'}
                  </Text>
                </RowFixed>
              )}
            </RowBetween>
          </FiatRow>
        )}
      </Container>
    </InputPanel>
    </>
  )
}
