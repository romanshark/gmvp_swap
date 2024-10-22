import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  min-width: 380px;
  max-height: 650px;
  min-height: 300px;
  margin-bottom: 12px;
  max-width: 100%;
  border-image: linear-gradient(225deg, #7303c0, #ec38bc, #f86c0d, #fee383) 1;
  border-width: 2px;

  border-style: solid;
  margin: 0 0 12px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'text']};
  background: transparent;
  backdrop-filter: blur(1px);
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 500px;
    margin: 0 32px 64px;
  }
`

export default StyledCard
