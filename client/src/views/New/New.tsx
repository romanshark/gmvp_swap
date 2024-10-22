import styled from 'styled-components'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import baselogo from '../../../public/images/baselogolarge.png'
import Page from 'views/Page'
import { Text, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRef, useState } from 'react'
import TypeIt from 'typeit-react'
import ReactPlayer  from 'react-player/lazy'
import ReactCardFlip from 'react-card-flip';
import Title from './Title'
import { HelpCard, CardTitle, AssSide, CardSub } from './Components'
import { FaArrowAltCircleRight, FaArrowCircleLeft } from 'react-icons/fa'
import Image from 'next/image'
import bri from '../../../public/images/bri.png'
import 'animate.css'


const NewPage = styled(Page)`
background-image: url(${baselogo.src});
background-size: 25vh;
background-opacity: 50%; 
z-index: -1; 
background-position: 50% 35%; 
background-repeat: no-repeat;
`
const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left; 
  margin-bottom: 12px;

  font-size: 40px; 
  @media (min-width: 768px) {
    font-size: 40px; 
  }
`;

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 16px;
  }
`

const New: React.FC = () => {
  const { theme } = useTheme()
  const isMobile = useMatchBreakpoints()
  const [isFlipped, setIsFlipped] = useState([false, false, false, false, false]);
  const [isPlaying, setIsPlaying] = useState([false, false, false, false, false]);

  const handleFlipClick = (index) => {
    const newFlips = [...isFlipped];
    const newPlaying = [...isPlaying]; 
    newFlips[index] = !newFlips[index];
    newPlaying[index] = !newPlaying[index];
    setIsFlipped(newFlips);
    setIsPlaying(newPlaying); 
 };

  return (
<>
<Page>
  <Title />
  <Flex flexDirection="column" justifyContent="center" alignItems="center" width="80%">
    <Text textAlign="center">
    BaseSwap is your go-to decentralized exchange, built on the Base blockchain. 
    BaseSwap operates independently of the Coinbase and Base chain team, 
    it's designed to make all investors, whether seasoned or new, feel right at home. 
    This page offers answers to frequently asked questions, along with user-friendly tips and tutorials. 
    Explore the cards below to learn more!
    </Text>
    
  </Flex>
<Flex width="100%" marginTop="2rem"  flexWrap="wrap" 
justifyContent="center" padding="1rem" alignItems="center"
flexDirection="row" 
className="animate__animated animate__fadeInLeft"
>
<Flex>
<ReactCardFlip isFlipped={isFlipped[0]} flipDirection="horizontal">
    <HelpCard>
      <CardTitle>
      "Why Crypto"
      </CardTitle>
      <CardSub>
        A message from the bald, beautiful leader of Coinbase. 
      </CardSub>
      <Flex flexDirection="column"  marginTop="2rem" justifyContent="center" alignItems="center"  >
        <img src="/images/bri.png" alt="hearteyesemoji" height="100px" width="100px" />
      </Flex>
      <Flex flexDirection="column" marginTop="3rem" justifyContent="center" alignItems="center" >
      <FaArrowAltCircleRight cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(0)} />
      </Flex>
    </HelpCard>
      <AssSide>
      <FaArrowCircleLeft cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(0)} />
          <Text> Overview of Base Chain</Text>
          <ReactPlayer autoplay={false} playing={isPlaying[0]} controls={true} width="100%"   url='https://www.youtube.com/watch?v=SD3sUw2N--A' />
      </AssSide>
  </ReactCardFlip>
  </Flex>

  <Flex>
<ReactCardFlip isFlipped={isFlipped[1]} flipDirection="horizontal">
    <HelpCard>
      <CardTitle>
      What's an L2?
      </CardTitle>
      <CardSub>
        Base Chain is a layer 2 blockchain. Here is a quick-hit video explaining what that means. 
      </CardSub>
      <Flex flexDirection="column"  marginTop="2rem" justifyContent="center" alignItems="center"  >
        <img src="/images/L2.png" alt="what is an L2?" height="100px" width="100px" />
      </Flex>
      <Flex flexDirection="column" marginTop="3rem" justifyContent="center" alignItems="center" >
      <FaArrowAltCircleRight cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(1)} />
      </Flex>
    </HelpCard>
      <AssSide>
      <FaArrowCircleLeft cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(1)} />
          <Text> Overview of Base Chain</Text>
          <ReactPlayer autoplay={false} playing={isPlaying[1]} controls={true} width="100%"   url='https://www.youtube.com/shorts/nBWVICDj5Bc' />
      </AssSide>
  </ReactCardFlip>
  </Flex>


<Flex>
<ReactCardFlip isFlipped={isFlipped[2]} flipDirection="horizontal">
    <HelpCard>
      <CardTitle>
      COINBASE AND BASE CHAIN
      </CardTitle>
      <CardSub>
        How to move your money on-chain!
      </CardSub>
      <Flex flexDirection="column"  marginTop="2rem" justifyContent="center" alignItems="center"  >
        <img src="/images/cbtobase.png" alt="cbtobase"  width="150px" />
        <img src="/images/MM.png" alt="cbtobase"  width="50px" />
      </Flex>
      <Flex flexDirection="column" marginTop="3rem" justifyContent="center" alignItems="center" >
      <FaArrowAltCircleRight cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(2)} />
      </Flex>
    </HelpCard>
      <AssSide>
      <FaArrowCircleLeft cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(2)} />
          
          <ReactPlayer autoplay={false} playing={isPlaying[2]} controls={true} width="100%"   url='https://www.youtube.com/watch?v=aaOa61tdeL4' />
          
      </AssSide>

</ReactCardFlip>
</Flex>
<Flex>
<ReactCardFlip isFlipped={isFlipped[3]} flipDirection="horizontal">
    <HelpCard>
      <CardTitle>
      Yield Farming
      </CardTitle>
      <CardSub>
        An overview of the chain, the DEX, and how to maximize your returns!
      </CardSub>
      <Flex flexDirection="column"  marginTop="2rem" justifyContent="center" alignItems="center"  >
      <Flex backgroundColor="#fff" flexDirection="row" 
          alignItems="center" justifyContent="center" 
    style={{ boxShadow: '0 4px 6px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', 
      borderRadius: '120px',   }}>
         
          <img src="images/bsx.png" alt="logo" width="100px"  />
      </Flex>
      </Flex>
      <Flex flexDirection="column" marginTop="5rem" justifyContent="center" alignItems="center" >
      <FaArrowAltCircleRight cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(3)} />
      </Flex>
    </HelpCard>
  
      <AssSide>
      <FaArrowCircleLeft cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(3)} />
          <ReactPlayer autoplay={false} playing={isPlaying[3]} controls={true} width="100%"   url='https://www.youtube.com/watch?v=Lq5FiiRU188' />
        
      </AssSide>

</ReactCardFlip>
</Flex>
<Flex>
<ReactCardFlip isFlipped={isFlipped[4]} flipDirection="horizontal">
    <HelpCard>
      <CardTitle>
      USING BASESWAP
      </CardTitle>
      <CardSub>
        How to use BaseSwap!
      </CardSub>
      <Flex flexDirection="column"  marginTop="2rem" justifyContent="center" alignItems="center"  >
      <Flex backgroundColor="#fff" flexDirection="row" 
          alignItems="center" justifyContent="center" 
    style={{ boxShadow: '0 4px 6px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', 
      borderRadius: '120px',   }}>
          <img src="/images/newlogo.png" alt="logo"  width="100px"  />
       
      </Flex>
      </Flex>
      <Flex flexDirection="column" marginTop="5rem" justifyContent="center" alignItems="center" >
      <FaArrowAltCircleRight cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(4)} />
      </Flex>
    </HelpCard>
  
      <AssSide>
      <FaArrowCircleLeft cursor="pointer" size={isMobile ? 40 : 80} onClick={() => handleFlipClick(4)} />
          <ReactPlayer autoplay={false} playing={isPlaying[4]} controls={true} width="100%"   url='https://www.youtube.com/watch?v=w6PWQ0HKCQA' />
        
      </AssSide>

</ReactCardFlip>
</Flex>



</Flex>


  </Page>
 
</>
  )
}

export default New
