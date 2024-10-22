import { Box, Flex } from '@pancakeswap/uikit'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import styled, { keyframes } from 'styled-components'
import Image from 'next/image'

import readybannerone from '../../public/images/baselogolarge.png'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important;
  }
`
const readyplayerone = "/images/readybannerone.png";
const StyledPage = styled.div<{ $removePadding: boolean; $noMinHeight }>`
  display: flex;
  max-width: 99vw;
  flex-direction: column;
  align-items: center;
  background-color: #111; 
 
  padding: ${({ $removePadding }) => ($removePadding ? '0' : '16px')};
  padding-bottom: 3rem;
  min-height: ${({ $noMinHeight }) => ($noMinHeight ? '110vh' : '110vh')};

  ${({ theme }) => theme.mediaQueries.xs} {
   
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '24px')};
    padding-bottom: 20px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '32px')};
    padding-bottom: 0;
    min-height: ${({ $noMinHeight }) => ($noMinHeight ? '100vh' : '100vh')};
  }
`;

// background-image: url(${readybannerone.src});
// background-position: 0% 90%; 
// background-size: 10vh; 
// background-repeat: repeat-x; 
// background-image: url(${readybannerone.src});
//   background-size: 100vw 25vh; 
//   background-position: 50% 50%; 
//   background-repeat: no-repeat;
 // background: linear-gradient(to bottom right, #0154FE, #fff); 
const Page: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    minHeight?: string 
    helpUrl?: string
  }
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  minHeight, 
  helpUrl = EXCHANGE_DOCS_URLS,
  ...props
}) => {
  return (
    <>
      <PageMeta />
      <StyledPage $removePadding={removePadding} $noMinHeight={noMinHeight}  {...props}>
        {children}
        <Flex flexGrow={1} />
        <Box
          style={{ backdropFilter: 'blur(2px)' }}
          display={['block', null, null, hideFooterOnDesktop ? 'none' : 'block']}
          width="99vw" backgroundColor="#111"
        >
          <Footer helpUrl={helpUrl} />
        </Box>
      </StyledPage>
    </>
  )
}

export default Page
