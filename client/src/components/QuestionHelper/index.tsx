import { HelpIcon, useTooltip, Box, BoxProps, Placement } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { FaRegQuestionCircle } from 'react-icons/fa'

interface Props extends BoxProps {
  text: string | React.ReactNode
  placement?: Placement
  size?: string
}

const Question = styled(FaRegQuestionCircle)`
  color: #fff;
  width: 16px;
  height: 16px;
  &:hover {
    color: #0154fe;
  }
`

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionHelper: React.FC<Props> = ({ text, placement = 'right-end', size = '16px', ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement })

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <Question width={size} />
      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
