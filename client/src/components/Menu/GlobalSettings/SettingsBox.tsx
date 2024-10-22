import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

export const SettingsBox = styled(Flex)`
  border: 2px solid #0154fe;
  border-radius: 12px;
  padding: 12px;
  margin: 0px;
  margin-bottom: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  min-height: 120px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  @media (min-width: 768px) {
    margin: 4px;
    margin-bottom: 2.5rem;
  }
`
export const SmallSettingsBox = styled(Flex)`
  border: 2px solid #0154fe;
  border-radius: 12px;
  padding: 12px;
  margin: 4px;
  margin-bottom: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  min-height: 90px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  @media (min-width: 768px) {
    margin: 4px;
    margin-bottom: 2.5rem;
  }
`

export const Frame = styled(Flex)`
  padding: 1px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  border-radius: 12px;
  border: 2px solid #0154fe;
  padding: 0px;
  min-height: 120px;
`
