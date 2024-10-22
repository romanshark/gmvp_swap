import { Currency, Pair, Token } from '@magikswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import MemeCityCurrencySearchModal from '../SearchModal/MemeCityCurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'
import TypeIt from 'typeit-react'
// bottom half of the input panel
const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 4px; 
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};

  padding-right: 4px; 
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0.25 0.5rem;
  border-radius: 8px;
  border: 0px solid #fff !important;  

  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 4px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 8px 8px 8px;
      height: auto;
    `};
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

//sits behind the whole thing
const InputPanel = styled.div`
  display: flex;
  border-radius: 8px;
  flex-flow: column nowrap;
  position: relative;
  margin-bottom: 0px;
  box-shadow: -1px -1px 12px #000; 
  padding: 0px;
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 2px;
  border: 3px solid ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};

  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 16px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
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

}
export default function MemeCityCurrencyInputPanel({
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


}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null
  const { isMobile } = useMatchBreakpoints();

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <MemeCityCurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <Box position="relative" id={id} backgroundColor={backgroundColor} borderRadius={borderRadius} 
    borderTopLeftRadius={borderTopLeftRadius}
    borderTopRightRadius={borderTopRightRadius}

    >
      <Flex alignItems="center" marginTop="6px" marginBottom="20px" justifyContent="space-between">
        <Flex>
          {beforeButton}
          <CurrencySelectButton
          style={{ backgroundColor: 'transparent'}}
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={36} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="60px" style={{ marginRight: '8px', 
                boxShadow: '0 1px 4px #000, 0 4px 12px #68B9FF, 0 4px 4px #fff, 4px 0px 12px #0154FD, -4px 0px 12px #68B9FF' }} />
              ) : null}
              {pair ? (
                <Text id="pair" color="text" fontWeight="600">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" color="text" fontSize="1.4rem" fontWeight="600">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select Token')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon color="text" />}
            </Flex>
          </CurrencySelectButton>
          {token && tokenAddress ? (
            <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="text"
                text={tokenAddress}
                tooltipMessage={t('Token address copied')}
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
              />
              <AddToWalletButton
                variant="text"
                p="0"
                height="auto"
                width="fit-content"
                tokenAddress={tokenAddress}
                tokenSymbol={token.symbol}
                tokenDecimals={token.decimals}
                tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
              />
            </Flex>
          ) : null}
        </Flex>
        {account && (
        //    <TypeIt 
        //    options={{
        //      cursorChar:" ", 
        //      cursorSpeed:1000000, speed: 75, 
        //    }}
        //    speed={10}
        //    getBeforeInit={(instance) => {
        //  instance
 
        //      .type("SWAP", {speed: 5000})
        //      ;
        //  return instance;
        //   }}> 
         
          <Text
            onClick={!disabled && onMax}
            color="text"
            fontSize={isMobile ? '14px' : '14px'}
            fontWeight="500"
            letterSpacing="0px"
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            {!hideBalance && !!currency
              ? t('BALANCE: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
          // </TypeIt>
        )}
      </Flex>
      <InputPanel>
        <Container  as="label" zapStyle={zapStyle} error={error}>
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
          </LabelRow>
          <InputRow selected={disableCurrencySelect}>
            {!!currency && showBUSD && Number.isFinite(amountInDollar) && (
              <Text fontSize="12px" color="textSubtle" mr="12px">
                ~{formatNumber(amountInDollar)} USD
              </Text>
            )}
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button onClick={onMax}  variant="max" marginRight="4px">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow>
        </Container>
        {/* {disabled && <Overlay />} */}
      </InputPanel>
    </Box>
  )
}
