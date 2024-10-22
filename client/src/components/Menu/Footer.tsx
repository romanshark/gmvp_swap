import { memo } from 'react'
import styled from 'styled-components'
import { LinkExternal, Link, Flex, RedditIcon, MediumIcon, TwitterIcon, TelegramIcon, DiscordIcon, useMatchBreakpoints} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Youtube } from 'react-feather'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { IoMdDocument } from 'react-icons/io'
import { RiTwitterXFill } from 'react-icons/ri'
import { PiTelegramLogoFill } from 'react-icons/pi'
import { LuScrollText } from 'react-icons/lu'
import { AiOutlineContainer } from 'react-icons/ai'

const Wrapper = memo(styled.div<{ $isSide: boolean }>`
  width: 100%;
  height: ${({ $isSide }) => ($isSide ? '100%' : 'auto')};
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: center; 
  margin-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 8px;
  padding-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex; 
  }
`);

const FlexStyled = styled(Flex)`
  margin: auto; 
  width: 100%; 
  @media (min-width: 768px) {
    width: 90%; 
  @media (min-width: 1208px) {
    width: 80%; 
    }
  @media (min-width: 1600px) {
    width: 70%; 
    }
`;

const DocsIcon = styled(AiOutlineContainer)`
  color: #0154FD;
  width: 36px;
  height: 36px; 
`;

const YouTubeIcon = styled(Youtube)`
  color: #0154FD;
  width: 36px;
  height: 36px; 
`;

const TGIcon = styled(PiTelegramLogoFill)`
  color: #0154FD;
  width: 36px;
  height: 36px; 
`;


const XIcon = styled(RiTwitterXFill)`
  color: #0154FD;
  width: 36px;
  height: 36px; 
`;

type FooterVariant = 'default' | 'side'

const Footer: React.FC<{ variant?: FooterVariant; helpUrl?: string }> = ({
  variant = 'default',
  helpUrl = EXCHANGE_DOCS_URLS,
}) => {
  const { t } = useTranslation()
  const { isTablet, isMobile} = useMatchBreakpoints()
  const isSide = variant === 'side'
  return (
  <Wrapper $isSide={isSide}>
    <FlexStyled flexDirection="row" alignItems="center" justifyContent="space-between" >
    <Link 
        marginRight={['1rem', null, null, '0rem' ]} 
        href="https://t.me/BaseswapFi" >
              <TGIcon /> 
    </Link>
    <Link 
        marginRight={['1rem', null, null, '0rem' ]} 
        href="https://medium.com/@BaseSwap" >
              <MediumIcon width="36px" color="#0154FD" /> 
    </Link>
    <Link 
        marginRight={['1rem', null, null, '0rem' ]} 
        href="https://twitter.com/BaseSwap_Fi" >
        
        <XIcon /> 
    
    </Link>

        <Link 
        marginRight={['1rem', null, null, '0rem' ]} 
        href="https://discord.gg/2zUzjyGxw2" >
          <DiscordIcon width="36px" color="#0154FD" /> 
    </Link>
    
    <Link 
        marginRight={['1rem', null, null, '0rem' ]} 
        href="https://www.youtube.com/@BaseSwap" >
              <YouTubeIcon  /> 
    </Link>

    {/* <Link 
    marginRight={['1rem', null, null, '0rem' ]} 
    href="https://reddit.com/r/baseswap/s/IudueT82Vz" >
          <RedditIcon width="36px" color="#0154FD" /> 
    </Link> */}

    <Link            
    href="https://base-swap-1.gitbook.io/baseswap/" >
            <DocsIcon />

    </Link>
  </FlexStyled>
</Wrapper>
  )
}

export default memo(Footer)
