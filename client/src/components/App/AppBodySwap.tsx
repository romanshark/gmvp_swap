import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)`
  margin-top: 20px;
  padding: .6rem; 
  margin-left: auto; 
  margin-right: auto; 
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 1rem; 
    width: 90%;
    min-width: 600px;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
