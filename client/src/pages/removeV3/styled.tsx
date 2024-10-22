import { MaxButton } from 'pages/positions/styled'
import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  padding: 20px;
  min-width: 460px;
`

export const SmallMaxButton = styled(MaxButton)`
  font-size: 1rem;
  text-transform: uppercase; 
  color: #fff;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};

  
`

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 500;
  color: #fff;
`

export default Wrapper
