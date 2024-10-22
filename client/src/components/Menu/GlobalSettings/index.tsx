import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'
import { PiGearFill } from 'react-icons/pi'
import styled from 'styled-components'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GearBox = styled(PiGearFill)`
  color: #0154fe;
  width: 32px;
  height: 32px;
  &:hover {
    color: #fff;
  }
`

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <Flex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
      >
        <GearBox />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
