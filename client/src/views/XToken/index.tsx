import { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex, Text, useModal, Button } from '@pancakeswap/uikit'
import { BsArrowRightCircle } from 'react-icons/bs'
import Page from '../Page'
import useMatchBreakpoints from '@pancakeswap/uikit/src/hooks/useMatchBreakpoints'
import StyledCard from 'views/Pools/components/PoolCard/StyledCard'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useXTokenInfo } from 'state/xToken/hooks'
import BigNumber from 'bignumber.js'
import VestingInfo from './components/VestingInfo'
import XTokenRedeemModal from './components/xTokenRedeemModal'
import { fetchUserXTokenDataAsync, fetchUserXTokenRedeemsInfoAsync } from 'state/xToken'
import { useAppDispatch } from 'state'
import TypeIt from 'typeit-react'

const HeaderCard = styled(StyledCard)`
  min-width: 350px;
  border: 2px solid #0154FD;
  box-shadow: 0 0 4px #68B9FF; 
  max-width: 100%;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.background};
  @media (min-width: 768px) {
    min-width: 550px; 
`


const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left;
  margin-bottom: 12px;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 68px;
  }
`
interface TextProps {
  isMobile: boolean
}

const CardTitle = styled.div<TextProps>`
  color: #0154FD;
  font-size: ${(props) => (props.isMobile ? '2rem' : '3rem')};
  font-weight: 600;
  text-align: center;
  margin-bottom: 0rem; 
  margin-top: 0rem;
`
const VestHeader = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 8px;
  margin-top: 4px;
`
const ConvertImages = styled(Flex)`
  align-items: center;
  justify-content: center;
`

const Pricing = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 8px;
`
const Action = styled(Flex)`
  margin-top: 16px;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`

const XToken: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  const { account, chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { userInfo } = useXTokenInfo()
  const xTokenBalance = useMemo(() => new BigNumber(userInfo?.xTokenBalance || 0), [userInfo])
  const [onPresentRedeem] = useModal(<XTokenRedeemModal userXTokenBalance={xTokenBalance} />)
  useEffect(() => {
    if (account) {
      dispatch(fetchUserXTokenDataAsync({ account, chainId }))
      dispatch(fetchUserXTokenRedeemsInfoAsync({ account, chainId }))
    }
  }, [account, chainId, dispatch])

  return (
    <>
      <Page>
        <WelcomeTypeIt
          options={{
            cursorChar: ' ',
            cursorSpeed: 1000000,
            speed: 75,
          }}
          speed={10}
          getBeforeInit={(instance) => {
            instance.type('xBSX', { speed: 5000 })
            return instance
          }}
        />
        <Text
          textAlign="center"
          mb="1.5rem" color="background" 
          fontSize={['.8rem', null, null, '1rem']}
          fontWeight={['500', null, null, '500']} >
            Earn xBSX by providing liquidity in&nbsp; 
            <a style={{ textDecoration: 'underline' }} href="/farms">
              Farms.
            </a>{' '}
        </Text>

        <Flex flexDirection={['column', null, null, 'row']}>
          <HeaderCard>
            <VestHeader>
              <CardTitle isMobile={isMobile}>VEST</CardTitle>
              <Text fontSize={['1rem', null, null, '1rem']} fontWeight="600" >
                CONVERT xBSX TO BSX
              </Text>
            </VestHeader>

            <ConvertImages>
              <img style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', borderRadius: '50%' }}
                src="/images/tokens/0xE4750593d1fC8E74b31549212899A72162f315Fa.png"
                width={isMobile ? 50 : 70} height={isMobile ? 50 : 70} alt="logo" />
              {/* <TokenImage token={xBSX} width={70} height={70} /> */}
              <BsArrowRightCircle size={isMobile ? 35 : 50 } style={{ marginRight: '3rem', marginLeft: '3rem' }} />
              <img style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', borderRadius: '50%' }}
                src="/images/tokens/0xd5046B976188EB40f6DE40fB527F89c05b323385.png"
                width={isMobile ? 50 : 70} height={isMobile ? 50 : 70} alt="logo" />
              {/* <TokenImage token={BSX} width={70} height={70} /> */}
            </ConvertImages>

            <Pricing>
              <Flex alignItems="center" justifyContent="space-between" mb="0px">
                <Text fontSize={['1rem', null, null, '0.9rem']} color="text">
                  xBSX BALANCE: {getFullDisplayBalance(xTokenBalance, 18, 3)}
                </Text>
              </Flex>
            </Pricing>

            <Action flexDirection={['row', null, null, 'row']}>
               <Button
                variant="secondary"
                marginRight="4px" marginLeft="4px"
                width={isMobile? '49%' : '90%' }
                onClick={onPresentRedeem}
                disabled={xTokenBalance.isZero()}
              >
                Redeem for BSX
              </Button>
              <Button
                variant="primary"
                width={isMobile? '49%' : '90%' }
                marginRight="4px"
                disabled={xTokenBalance.isZero()}
              >
                <a href="/pools" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Stake Instead{' '}
                </a>
              </Button>
            </Action>
          </HeaderCard>
        </Flex>

        <Flex alignItems="center" flexDirection="column" marginTop="1rem" width={['100%', '100%', '100%', '60%']}>
          <VestingInfo />
        </Flex>

      </Page>
    </>
  )
}

export default XToken
