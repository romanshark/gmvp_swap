import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@web3-react/core'
import PageTitle from 'components/PageTitle/PageTitle'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import TypeIt from 'typeit-react'
import 'animate.css'

const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left; 
  margin-bottom: 12px;
  text-transform: uppercase; 
  font-size: 40px; 
  @media (min-width: 768px) {
    font-size: 68px; 
  }
`;

const Body = styled(CardBody)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))

  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }

    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <>
      {/* <PageTitle title="Liquidity" /> */}
      <Page>
      <WelcomeTypeIt 
          options={{
            cursorChar:" ", 
            cursorSpeed:1000000, speed: 75, 
          }}
          speed={10}
          getBeforeInit={(instance) => {
        instance

            .type("LIQUIDITY", {speed: 5000})
            ;
        return instance;
         }}> 
         </WelcomeTypeIt>
        <AppBody>
          <AppHeader title={t('UNSTAKED LIQUIDITY')} subtitle={t('')} />
          <Body>
            {renderBody()}
            {account && !v2IsLoading && (
              <Flex flexDirection="column" alignItems="center" mt="24px">
                <Text 
                fontSize="12px"
                color="text" 
                textTransform="uppercase"
                 mb="8px">
                  {t("Don't see a pool you joined?")}
                </Text>
                <Link href="/find" passHref>
                  <Button id="import-pool-link" variant="revampreverse1" scale="md" as="a">
                    {t('Find other LP tokens')}
                  </Button>
                </Link>
              </Flex>
            )}
          </Body>
          <CardFooter style={{ textAlign: 'center' }}>
            <Link href="/add" passHref>
              <Button  
              variant="revamp"
              className="animate__animated animate__rollIn" id="join-pool-button" 
              width="100%" 
              startIcon={<AddIcon color="white" />}>
                {t('Add Liquidity')}
              </Button>
            </Link>
          </CardFooter>
        </AppBody>
      </Page>
    </>
  )
}
