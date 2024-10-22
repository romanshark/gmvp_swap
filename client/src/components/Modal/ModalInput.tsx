import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  height: 60px; 
  border-radius: 8px;
  box-shadow: inset 0 0 4px #222; 
  color: ${({ theme }) => theme.colors.text};
  padding: 4px 0px; 
  width: 100%;
  margin-bottom: 16px; 
  justify-content: center; 
`

const StyledInput = styled(Input)`
  box-shadow: none;
  font-size: 1.5rem; 
  width: 50%; 

  margin: 0 8px;
  padding: 0 8px;
  border: none;
  

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 50%;
    font-size: 1.6rem; 
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }

    const balanceUnits = parseUnits(balance, decimals)
    return formatBigNumber(balanceUnits, decimals, decimals)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Flex justifyContent="flex-end" marginBottom="8px">
          {/* <Text fontSize="14px" fontWeight="400">{inputTitle}</Text> */}
          <Text fontSize="14px" textTransform="uppercase"> 
                {t('%balance%', { balance: displayBalance(max) })} &nbsp; 
                {symbol} 
          </Text>
      </Flex>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex alignItems="center" justifyContent="space-between" >
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Button variant="max" onClick={onSelectMax} mr="12px" >
            {t('Max')}
          </Button>
          
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="background">
          {t('No tokens to stake')}:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {t('Get %symbol%', { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
