import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  min-width: 350px;
  border: none;
  box-shadow: 0 1px 4px #fff, 1px 0px 4px #0154FD, -1px 0px 4px #68B9FF; 
  max-width: 100%;
  margin: 18px; 
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 360px;
    margin: 12px; 
  }
`

export default StyledCard
