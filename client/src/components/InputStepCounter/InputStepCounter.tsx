import { FeeAmount } from '@baseswapfi/v3-sdk2'
import { Button, Text, Flex } from '@pancakeswap/uikit'
import { OutlineCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import styled, { keyframes } from 'styled-components'

import { Input as NumericalInput } from '../NumericalInput'
import { useTranslation } from '@pancakeswap/localization'

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }
  70% {
    box-shadow: 0 0 0 2px ${color};
  }
  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const FocusedOutlineCard = styled(OutlineCard)<{ active?: boolean; pulsing?: boolean }>`
  border-color: ${({ active, theme }) => active && theme.colors.border};
  padding: 8px;
  animation: ${({ pulsing, theme }) => pulsing && pulse(theme.colors.gradients.basedsex)} 0.8s linear;
  margin-bottom: 8px;
  border-radius: 10px;
`
const InputRow = styled(Flex)`
  display: flex;
`
const SmallButton = styled(Button)`
  border-radius: 8px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 2px;
  height: auto; 
`
const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  font-weight: 500;

  text-align: left;
  margin-left: 0px; 
  min-width: 150px; 

`
const InputColumn = styled(AutoColumn)`
  width: 100%;
`
const InputTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
`

const ButtonLabel = styled(Text)<{ disabled: boolean }>`
  color: ${({ theme, disabled }) => (disabled ? theme.colors.secondary : theme.colors.text)} !important;
`

interface StepCounterProps {
  value: string
  onUserInput: (value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA?: string
  tokenB?: string
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  // @ts-ignore
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)
  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)
  const { t } = useTranslation()
  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      // @ts-ignore
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <FocusedOutlineCard pulsing={pulsing} active={active} onFocus={handleOnFocus} onBlur={handleOnBlur} width="100%">
      <InputRow >
        <InputColumn  justify="flex-start">
          <Text fontSize="24px" textAlign="center">
            {title}
          </Text>
          <Flex flexDirection="row" justifyContent="flex-start"  alignItems="center">
          <StyledInput
            className="rate-input-0"
            value={localValue}
            fontSize="20px"
            disabled={locked}
            onUserInput={(val) => {
              setLocalValue(val)
            }}
          />
          <Text fontSize="20px" >
            {t(`${tokenB} per ${tokenA}`)}
          </Text>
          </Flex>
        </InputColumn>

        <AutoRow gap="8px">
          {!locked && (
            <SmallButton variant="gason" data-testid="increment-price-range" onClick={handleIncrement} disabled={incrementDisabled}>
              <ButtonLabel disabled={incrementDisabled} fontSize="12px">
              <Plus size={48} />
              </ButtonLabel>
            </SmallButton>
          )}
          {!locked && (
            <SmallButton variant="gason" data-testid="decrement-price-range" onClick={handleDecrement} disabled={decrementDisabled}>
              <ButtonLabel disabled={decrementDisabled} fontSize="12px">
                <Minus size={48} />
              </ButtonLabel>
            </SmallButton>
          )}
        </AutoRow>
      </InputRow>
    </FocusedOutlineCard>
  )
}

export default StepCounter
