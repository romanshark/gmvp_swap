import { Percent } from '@baseswapfi/sdk-core'
import { AppState, useAppDispatch } from 'state'
import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import JSBI from 'jsbi'
import { updateHideClosedPositions, updateUserSlippageTolerance } from '../actions'

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): [Percent, (slippageTolerance: Percent) => void] {
  // Re-use current slippage settings from V2
  const userSlippageToleranceRaw = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
    return state.user.userSlippageTolerance
  })

  const userSlippageTolerance = useMemo(() => {
    // TODO(WEB-1985): Keep `userSlippageTolerance` as Percent in Redux store and remove this conversion
    // userSlippageToleranceRaw === SlippageTolerance.Auto
    //   ? SlippageTolerance.Auto
    //   : new Percent(userSlippageToleranceRaw, 10_000),
    return new Percent(userSlippageToleranceRaw || 500, 10_000)
  }, [userSlippageToleranceRaw])

  const dispatch = useAppDispatch()

  const setUserSlippageTolerance = useCallback(
    (userTolerance: Percent) => {
      let value: number

      try {
        value = JSBI.toNumber(userTolerance.multiply(10_000).quotient)
      } catch (error) {
        // value = SlippageTolerance.Auto
        value = 0
      }

      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value,
        }),
      )
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

/**
 *Returns user slippage tolerance, replacing the auto with a default value
 * @param defaultSlippageTolerance the value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const [allowedSlippage] = useUserSlippageTolerance()
  return allowedSlippage.greaterThan(0) ? allowedSlippage : defaultSlippageTolerance
}

export function useUserHideClosedPositions(): [boolean, (newHideClosedPositions: boolean) => void] {
  const dispatch = useAppDispatch()

  const hideClosedPositions = useSelector<AppState, AppState['user']['userHideClosedPositions']>(
    (state) => state.user.userHideClosedPositions,
  )

  const setHideClosedPositions = useCallback(
    (newHideClosedPositions: boolean) => {
      dispatch(updateHideClosedPositions({ userHideClosedPositions: newHideClosedPositions }))
    },
    [dispatch],
  )

  return [hideClosedPositions, setHideClosedPositions]
}
