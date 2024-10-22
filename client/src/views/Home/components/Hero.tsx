import { Button, Flex, Heading, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import bunnyImage from '../../../../public/images/home/lunar-bunny/bunny@2x.png'
import CompositeImage, { CompositeImageProps } from './CompositeImage'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import banner from '../../../../public/images/newbanner3.png'
import baseswap from '../../../../public/images/newlogo.png'
import bsx from '../../../../public/images/bsx.png'
import TVL from 'components/TVL'
import TypeIt from 'typeit-react'
import 'animate.css'


const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  text-align: center; 
  letter-spacing: 2px; 
  margin-bottom: 12px;
  text-transform: uppercase; 
  font-size: 18px; 
  @media (min-width: 768px) {
    font-size: 20px; 
    text-align: left; 
  }
`;

const TitleTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
  font-size: 36px; 
  @media (min-width: 768px) {
    font-size: 80px; 
    text-align: left; 
  }
`;

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

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; 
  }
`

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { isMobile, isMd } = useMatchBreakpoints();

  return (
<>
  {/* <BgWrapper>
    <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
  </BgWrapper> */}
  <Flex
    position="relative"
    flexDirection={['column', null, null, 'row']}
    alignItems={['center', null, null, 'center']}
    justifyContent="center"
    mt={[account ? '5px' : '5px', null, '0rem']}
    id="homepage-hero"
  >
    <Flex
      marginTop={['2rem', null, null, '0rem']}
      flex="1"
      flexDirection="column"
      paddingX={['0px', null, null, '2rem']}
      marginX={['0rem', null, null, '2rem']}
    >
          <WelcomeTypeIt 
            options={{
              cursorSpeed:1000000, speed: 75, 
            }}
            speed={10}
            getBeforeInit={(instance) => {
          instance
              .type("Welcome to", {speed: 10000})
              .type("...")
              ;
          return instance;
            }}> 
          </WelcomeTypeIt>
          <TitleTypeIt 
          className="animate__animated animate__fadeInLeft"
          options={{
            cursorSpeed:1000000, speed: 75, 
          }}
          speed={10}
          getBeforeInit={(instance) => {
        instance
            .pause(1000)
            .type("BASE.", {speed: 10000})
            .pause(1000)
            .move(1, { delay: 200 })
            .delete(1)
            .pause(100)
            .move(-4)
            .pause(100)
            .move(5)
            .type(" Chain.")
            .pause(1000)
            .delete(7)
            .pause(500)
            .delete(4)
            .type("Base")
            .pause(500)
            .type("Swap")

            .type(".")
            ;
        return instance;
          }}>
          </TitleTypeIt>
          <Heading      
            className="animate__animated animate__fadeInLeft animate__delay-5s" 
            scale="md" mb="18px" 
            mt={['24px', null, null, '0px' ]} 
          >
          {t('Harder. Better. Faster. Stronger.')}
          </Heading>
      
    
      <Flex
        className="animate__animated animate__rollIn"
        flexDirection={['column', null, null, 'row']}
        marginLeft={['0rem', null, null, '1rem']}
        marginTop={['2rem', null, null, '2rem']}
        marginBottom={['3rem', null, null, '0rem']}

        alignItems={['center', null, null, 'flex-end']}
        justifyContent={['center', null, null, 'flex-start']}
      >
        
        {!account && (
          <ConnectWalletButton
            variant="primary"
            height="100%"
            width={['75vw', null, null, '25vw']}
            mr={[null, null, null, '8px']}
          />
        )}
        <NextLinkFromReactRouter to="/swap">
          <Button
            mt={['1rem', null, null, null]}
            width={['75vw', null, null, '25vw']}
            variant={!account ? 'secondary' : 'primary'}
          >
            {t('SWAP NOW')}
          </Button>
        </NextLinkFromReactRouter>
        
      </Flex>
      <Flex mt="2rem" mb="0rem" >
      <Heading      
            className="animate__animated animate__fadeInLeft " 
            scale="sm" 
            mt={['24px', null, null, '0px' ]} 
          >
          {t('BaseSwap is developed and managed independently of the Coinbase/Base team!')}
          </Heading>
      </Flex>
    </Flex>

    <Flex
      className="animate__animated animate__fadeInRight"
      height={['200px', null, null, '350px']}
      width={['200px', null, null, '350px']}
      flex={['1', null, null, '1']}
      mb={['0px', null, null, '0']}
      mt={['0px', null, null, '0']}
      position="relative"
    >
      <BunnyWrapper>
      
      <Flex backgroundColor="#fff" flexDirection="row" 
      marginRight={['0rem', null, null, '2rem']}
      marginTop={['0rem', null, null, '2rem']}
      alignItems="center" justifyContent="center" 
      style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', 
        borderRadius: '120px', marginBottom: '8px'  }}>
            <Image src={baseswap} alt="logo" height="230px" width="230px"  />
            <Image src={bsx} alt="logo" height="230px" width="230px"  />
        </Flex>
        {/* <Image  src={banner} priority alt={t('BaseSwap Logo')} /> */}

        </BunnyWrapper>
      {/* <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper> */}
    </Flex>
  </Flex>
</>
  )
}

export default Hero
