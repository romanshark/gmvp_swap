import { useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Button, Input, Flex, Box, Toggle, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import QuestionHelper from '../../QuestionHelper'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import { ImHourGlass } from 'react-icons/im'
import { useShowRoute } from '../../../state/user/hooks'
import { TbRoute } from 'react-icons/tb'
import { SettingsBox, SmallSettingsBox } from './SettingsBox'

const Route = styled(TbRoute)`
  color: #fff;
  width: 36px;
  height: 36px;
`

const Countdown = styled(ImHourGlass)`
  color: #fff;
  width: 32px;
  height: 32px;
`

const Slip = styled(Activity)`
  color: #fff;
  width: 40px;
  height: 40px;
`
enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')
  const [showRoute, toggleSetShowRoute] = useShowRoute()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTtl(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex flexDirection="column" mb="1rem" paddingX="0rem">
      <SettingsBox flexDirection="column" mb="2.5rem">
        <Flex mb="8px" alignItems="center" justifyContent="center">
          <Slip />
          <Text marginLeft="3px" marginRight="2px" textAlign="center" fontSize="1rem" fontWeight="400" color="#fff">
            {t('SLIPPAGE')}
          </Text>
          <QuestionHelper
            text={t(
              'Setting slippage high can help transactions go through, but can result in inefficient pricing or transaction front-running. Use with caution.',
            )}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex justifyContent="space-between" paddingX={isMobile ? '0rem' : '2rem'}>
          <Button
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
            variant={userSlippageTolerance === 10 ? 'gason' : 'gasoff'}
          >
            <Text fontSize="16px">0.1%</Text>
          </Button>
          <Button
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
            variant={userSlippageTolerance === 50 ? 'gason' : 'gasoff'}
          >
            <Text fontSize="16px">0.5%</Text>
          </Button>
          <Button
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
            variant={userSlippageTolerance === 100 ? 'gason' : 'gasoff'}
          >
            <Text fontSize="16px">1.0%</Text>
          </Button>
          <Flex alignItems="center">
            <Box width="76px">
              <Input
                scale="sm"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={(userSlippageTolerance / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                }}
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                  }
                }}
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
              />
            </Box>
            <Text fontSize="16px" color="text" bold ml="4px">
              %
            </Text>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : 'red'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </SettingsBox>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={isMobile ? '0px' : '0px'}>
        <SmallSettingsBox>
          <Flex mb="8px" alignItems="center" justifyContent="center">
            <Countdown />
            <Text marginLeft="3px" marginRight="2px" textAlign="center" fontSize="1rem" fontWeight="400" color="#fff">
              {t('DEADLINE')}
            </Text>
            <QuestionHelper
              text={t('Your transaction will revert if it is left confirming for longer than this time.')}
              placement="top-start"
              ml="4px"
            />
          </Flex>
          <Flex justifyContent="center" mb="8px">
            <Flex flexDirection="row" width="150px" justifyContent="center" alignItems="center">
              <Input
                scale="sm"
                inputMode="numeric"
                pattern="^[0-9]+$"
                isWarning={!!deadlineError}
                onBlur={() => {
                  parseCustomDeadline((ttl / 60).toString())
                }}
                placeholder={(ttl / 60).toString()}
                value={deadlineInput}
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomDeadline(event.target.value)
                  }
                }}
              />
              <Text marginLeft="8px" fontSize="16px">
                MINUTES
              </Text>
            </Flex>
          </Flex>
        </SmallSettingsBox>

        <SmallSettingsBox>
          <Flex mb="8px" alignItems="center" justifyContent="center">
            <Route />
            <Text marginLeft="3px" marginRight="2px" textAlign="center" fontSize="1rem" fontWeight="400" color="#fff">
              {t('ROUTE')}
            </Text>
            <QuestionHelper
              text={t(
                'BaseSwap routes trades through liquidity pools in order to return the best price. Toggle this on to see the path your trade will take.',
              )}
              placement="top-start"
              ml="4px"
            />
          </Flex>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Toggle
              id="show-route"
              checked={showRoute}
              scale="md"
              onChange={() => {
                toggleSetShowRoute()
              }}
            />
          </Flex>
        </SmallSettingsBox>
      </Flex>
    </Flex>
  )
}

export default SlippageTabs
