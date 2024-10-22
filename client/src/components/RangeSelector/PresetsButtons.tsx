import { Button } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Row'
import Trans from 'components/Trans'
import styled from 'styled-components'

const CustomButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  border-radius: 8px;
  font-size: 14px;
  padding: 4px;
  height: 35px; 
`

interface PresetsButtonsProps {
  onSetFullRange: () => void
}

export default function PresetsButtons({ onSetFullRange }: PresetsButtonsProps) {
  return (
    <AutoRow gap="4px" width="auto">
      <CustomButton onClick={onSetFullRange}>
        <Trans>Full Range</Trans>
      </CustomButton>
    </AutoRow>
  )
}
