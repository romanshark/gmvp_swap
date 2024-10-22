import { Checkbox } from '@pancakeswap/uikit'
import styled from 'styled-components'

const ZapCheckBoxWrapper = styled.label`
  display: grid;
  place-content: center;
  background: transparent;
  border-radius: 8px 0px 0px 0px;
  width: 40px;
`

export const ZapCheckbox = (props) => {
  return (
    <ZapCheckBoxWrapper>
      <Checkbox scale="sm" {...props} />
    </ZapCheckBoxWrapper>
  )
}
