import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'

const selectXTokeInfo = (state: State) => state.xToken

export const xTokenInfoSelector = createSelector([selectXTokeInfo], (info) => {
  return info
})
