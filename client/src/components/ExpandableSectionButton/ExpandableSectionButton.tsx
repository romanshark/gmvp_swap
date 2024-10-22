import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { FaChevronCircleDown } from 'react-icons/fa'
import { FaChevronCircleUp } from 'react-icons/fa'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Down = styled(FaChevronCircleDown)`
  width: 36px;
  height: 36px;
  color: #0154fe;
`

const Up = styled(FaChevronCircleUp)`
  width: 36px;
  height: 36px;
  color: #0154fe;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0px;
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded = false }) => {
  const { t } = useTranslation()
  const handleOnClick = useCallback(() => onClick?.(), [onClick])

  return (
    <Wrapper aria-label={t('Hide or show expandable content')} role="button" onClick={handleOnClick}>
      <Text color="text" bold>
        {expanded ? t('') : t('')}
      </Text>
      {expanded ? <Up /> : <Down />}
    </Wrapper>
  )
}

export default ExpandableSectionButton
