import styled from 'styled-components'
import { Card, Text } from '@pancakeswap/uikit'

const HelpCard = styled(Card)<{ isFinished?: boolean }>`
  min-width: 350px;
  max-width: 500px;
  min-height: 375px;
  max-height: 375px; 
  padding: 8px;   
  border: 4px solid #0154FD;
  border-radius: 4px; 
  box-shadow: 0 4px 4px #fff, 0 -4px 4px #fff, 6px 0px 6px #68B9FF, -8px 0px 8px #68B9FF; 
  
  margin: 24px; 
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 360px;
    max-height: 350px; 
  }
`
const AssSide = styled(HelpCard)`
  min-width: 90vw; 
  min-height: 500px; 
`;

const CardTitle = styled(Text)`
  font-size: 1.5rem; 
  text-transform: uppercase; 
  font-weight: 600; 
  color: ${({ theme }) => theme.colors.text};
  text-align: center; 
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 1.5rem; 
    
  }
`

const CardSub = styled(Text)`
  font-size: 1rem; 
  text-transform: uppercase; 
  font-weight: 500; 
  margin-top: 12px; 
  color: ${({ theme }) => theme.colors.background};
  text-align: center; 
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px; 
    
  }
`

export { HelpCard, AssSide, CardTitle, CardSub }
