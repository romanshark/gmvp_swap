import { Gap } from '@pancakeswap/uikit'
import styled from 'styled-components'

// export const Column = styled.div<{
//   gap?: Gap
// }>`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   gap: ${({ gap, theme }) => gap && theme.grids[gap]};
// `

export const Column = styled.div<{
  gap?: Gap
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

// export const AutoColumn = styled.div<{
//   gap?: Gap | string
//   justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
//   grow?: true
// }>`
//   display: grid;
//   grid-auto-rows: auto;
//   grid-row-gap: ${({ gap, theme }) => (gap && theme.grids[gap as Gap]) || gap};
//   justify-items: ${({ justify }) => justify && justify};
//   flex-grow: ${({ grow }) => grow && 1};
// `

export const AutoColumn = styled.div<{
  gap?: Gap | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
  grow?: true
}>`
  display: grid;
  grid-auto-rows: auto;
  justify-items: ${({ justify }) => justify && justify};
  flex-grow: ${({ grow }) => grow && 1};
`

export default Column
