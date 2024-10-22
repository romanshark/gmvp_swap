import { AutoColumn } from 'components/Column'
import CurrencyInputPanelV3 from 'components/CurrencyInputPanelV3'
import Input from 'components/NumericalInput'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  padding: 0px; 
  padding-left: 12px; 
  padding-right: 12px; 
`

export const ScrollablePage = styled.div`
  padding: 20px 8px 0px;
  position: relative;
  display: flex;
  flex-direction: column;
`

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
`

export const CurrencyDropdown = styled(CurrencyInputPanelV3)`
  width: 48.5%;
`

export const StyledInput = styled(Input)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: left;
  font-size: 18px;
  width: 100%;
  color: white;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div<{ wide: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;


`

const MediumOnly = styled.div``

export default MediumOnly
