import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

interface BodyWrapperProps {
  marginTop?: string
}

//bodywrapper sits behind the card
export const BodyWrapper = styled(Card)<BodyWrapperProps>`
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  padding: 0rem;
  margin-top: ${({ marginTop }) => marginTop || '1rem'};
  max-width: 550px;
  width: 100%;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
interface AppBodyProps {
  children: React.ReactNode
  marginTop?: string
}

export default function AppBody({ children, marginTop }: AppBodyProps) {
  return <BodyWrapper marginTop={marginTop}>{children}</BodyWrapper>
}
