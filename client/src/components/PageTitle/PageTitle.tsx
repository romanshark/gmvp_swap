import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Text } from '@pancakeswap/uikit'
import Container from '../Layout/Container'
import { tags, scales, HeadingProps } from './types'

const Outer = styled(Box)<{ background?: string }>`
  background: transparent;
  margin-top: 1rem;
`

const Inner = styled(Container)`
  padding-top: 12px;
  padding-bottom: 0px;
`

const DoItUp = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: 2rem;
  color: #fff;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 2px;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 3rem;
  }
`

interface PageTitleProps {
  background?: string
  title: string
}

const PageTitle: React.FC<PageTitleProps> = ({ title, background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>
      <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
        <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
          <DoItUp as="h1" scale="xxl" color="#fff" mb="4px">
            {title}
          </DoItUp>
        </Flex>
      </Flex>
      {children}
    </Inner>
  </Outer>
)

export default PageTitle
