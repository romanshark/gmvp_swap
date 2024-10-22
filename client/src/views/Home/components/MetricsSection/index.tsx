import { Heading, Flex, Text, ChartIcon, CommunityIcon, SwapIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import Image from 'next/image'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import logo from '../../../../../public/images/newlogo.png'
import bsx from '../../../../../public/images/bsx.png'
import Marquee from "react-fast-marquee"; 
import styled from 'styled-components'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile, isMd } = useMatchBreakpoints();

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="flex-start" alignItems="center" flexDirection="column" mt="-2rem">
            {!isMobile && (
        <Text fontSize="6rem" color="text" >
              BaseSwap.
        </Text>
            )}
        <Flex backgroundColor="#fff" flexDirection={['row', null, null, 'row' ]} style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', 
        borderRadius: '120px', marginBottom: '8px'  }}>
            {!isMobile && (
            <>
             
            <Image src={logo} alt="logo"  width="150px" height="150px"  />
            <Image src={bsx} alt="logo" width="150px" height="150px"  />
                </>
            )}
        </Flex>
        {isMobile && (
            <Text fontSize="4rem" color="background" >
              BaseSwap
            </Text>
        )}
        <Heading textAlign="center" scale={isMobile ? 'lg' : 'xl'}>
          Because you really only live once.
        </Heading>

      <Text marginTop="1.5rem" marginBottom="1rem" textAlign="center" color="textSubtle">

          OFTEN IMITATED, NEVER DUPLICATED 🚀 <br /> <br /> 

          Welcome to BaseSwap, the apex decentralized exchange on Base Chain. 
          As pioneers in the field, we offer investors a transparent and efficient gateway to elevate their investment portfolios. 
          Experience the evolution of trading without the complexities, hidden fees, or unnecessary taxes you'll get elsewhere. 
          Why settle for less? Empower your financial journey with BaseSwap, and watch your assets thrive. 
          🌱

      </Text>
      {/* <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          Join us on BASE chain now.
          <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
          {inFunds}
        </Text>
      </Flex> */}

  
  
      {/* <Flex flexDirection={['column', null, null, 'row']}> */}
      <Marquee 
        pauseOnHover={true} pauseOnClick={true}
        speed={30}
        gradient={true}
        gradientColor={[ 128, 170, 254]}
        gradientWidth={50} >
        <IconCard
          style={{ backgroundColor: '#333' }}
          {...UsersCardData}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <StatCardContent
            headingText="Safe and secure"
            bodyText={t('Trusted and secure platform')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
        <IconCard
          style={{ backgroundColor: '#333' }}
          {...TradesCardData}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <StatCardContent
            // headingText={t('%trades% trades', { trades })}
            headingText="Rapid swaps"
            bodyText={t('On the BASE blockchain')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
        <IconCard style={{ backgroundColor: '#333' }} {...StakedCardData}>
          <StatCardContent
            headingText="Stake and farm"
            bodyText={t('Grow your portfolio on BASE')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
        </Marquee>
      {/* </Flex> */}
    </Flex>
  )
}

export default Stats
