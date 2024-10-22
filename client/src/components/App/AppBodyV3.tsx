import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

//bodywrapper sits behind the card

export const AddV3Wrapper = styled(Card)`
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  padding: 0rem;
  margin-top: 1rem; 
  max-width: 425px;
  width: 100%;
  @media (min-width: 768px) {
   max-width: 650px;  
   }
  @media (min-width: 1200px) {
    max-width: 750px;  
    }
`
export default function AddV3Body({ children }: { children: React.ReactNode }) {
  return <AddV3Wrapper>{children}</AddV3Wrapper>
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */