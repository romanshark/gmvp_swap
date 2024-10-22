import { CardHeader, Flex, Heading, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients.basedsexgray};
  border-radius: 0px;
  border-bottom: 2px solid #fff;
  padding: 8px;
`

const PoolCardHeader: React.FC<{
  isFinished?: boolean
  isStaking?: boolean
}> = ({ isFinished = false, isStaking = false, children }) => {
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  )
}

export const PoolCardHeaderTitle: React.FC<{ isFinished?: boolean; title: ReactNode; subTitle: ReactNode }> = ({
  isFinished,
  title,
  subTitle,
}) => {
  return (
    <Flex flexDirection="column">
      <Text color={isFinished ? 'textDisabled' : 'text'} fontSize="1.2rem">
        {title}
      </Text>
      <Text fontSize="1rem" color={isFinished ? 'textDisabled' : 'text'}>
        {subTitle}
      </Text>
    </Flex>
  )
}

export default PoolCardHeader
