import Trans from 'components/Trans'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Text, Flex, Card, useMatchBreakpointsContext, Skeleton } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { useMemo } from 'react'
import { AlertTriangle, Inbox } from 'react-feather'
import styled, { css, useTheme } from 'styled-components'
import { PositionDetails } from 'types/position'
import Link from 'next/link'
import { LoadingRows } from './styled'
import { useUserHideClosedPositions } from 'state/user/v3/hooks'
import { isSupportedChain } from 'config/constants/chains'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useFilterPossiblyMaliciousPositions } from 'hooks/v3/useFilterPossiblyMaliciousPositions'
import { useTranslation } from '@pancakeswap/localization'
import Page from 'views/Page'
import 'animate.css'
import { GiFallingStar } from 'react-icons/gi'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { useUserClaimsDataSelector } from 'state/user/selectors'
import NewPositionButton from 'components/NewPositionButton'

const PageTitle = styled(Text)`
  font-weight: 400;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 48px;
  }
`

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.colors.text};
`

const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }
`

const PoolMenuItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 500;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

const MainContentWrapper = styled.main`
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  border: 3px solid ${({ theme }) => theme.colors.cardBorder};

  padding: 0px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const RewardsCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  border-width: 3px;
  width: 100%;
  border-color: ${({ theme }) => theme.colors.text};
  min-width: 400px;
  @media screen and (min-width: 576px) {
    max-width: 500px;
  }
  @media screen and (min-width: 800px) {
    max-width: 600px;
  }
`

export const DarkCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
`

function PositionsLoadingPlaceholder() {
  return (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  )
}

function WrongNetworkCard() {
  const theme = useTheme()

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <Text>
                <Trans>Pools</Trans>
              </Text>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <Text color={theme.colors.tertiary} textAlign="center">
                  <NetworkIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">
                    <Trans>Your connected network is unsupported.</Trans>
                  </div>
                </Text>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      {/* <SwitchLocaleLink /> */}
    </>
  )
}

export default function Pool() {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  const { isLoading: rewardsLoading, data: rewardData, doClaim, isClaiming } = useMerklRewards()
  const { pendingMerklBSX, pendingMerklXBSX, pendingMerklValue } = useUserClaimsDataSelector()

  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()
  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []],
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)],
    [closedPositions, openPositions, userHideClosedPositions],
  )

  const filteredPositions = useFilterPossiblyMaliciousPositions(userSelectedPositionSet)

  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />
  }

  const showConnectAWallet = Boolean(!account)

  // const menuItems = [
  //   {
  //     content: (
  //       <PoolMenuItem>
  //         <Trans>Migrate</Trans>
  //         <ChevronsRight size={16} />
  //       </PoolMenuItem>
  //     ),
  //     link: '/migrate/v2',
  //     external: false,
  //   },
  //   {
  //     content: (
  //       <PoolMenuItem>
  //         <Trans>V2 liquidity</Trans>
  //         <Layers size={16} />
  //       </PoolMenuItem>
  //     ),
  //     link: '/pools/v2',
  //     external: false,
  //   },
  //   {
  //     content: (
  //       <PoolMenuItem>
  //         <Trans>Learn</Trans>
  //         <BookOpen size={16} />
  //       </PoolMenuItem>
  //     ),
  //     link: 'https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-',
  //     external: true,
  //   },
  // ]

  return (
    <Page>
      <PageTitle>MANAGE POSITIONS</PageTitle>
      <Flex width={isMobile ? '100%' : '60%'} flexDirection="column">
        <Text fontSize="16px" textAlign="center">
          Add or remove liquidity from BaseX Concentrated Liquidity Positions.
        </Text>
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <GiFallingStar size={isMobile ? '24px' : '64px'} color="#0154FE" />
          <Text marginX="16px" marginTop="1rem" fontSize="16px" textAlign="center">
            All positions earn trading fees from that pair. You can also earn BSX and xBSX by creating a Concentrated
            Liquidity position for a pair found in &nbsp;
            <Link href="/farmV3">
              <u style={{ cursor: 'pointer' }}>Concentrated Farms</u>
            </Link>
            .
          </Text>
          <GiFallingStar size={isMobile ? '24px' : '64px'} color="#0154FE" />
        </Flex>
      </Flex>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0" marginBottom="12px">
              <Text fontSize="24px">
                <Trans>CURRENT POSITIONS</Trans>
              </Text>
              <ButtonRow>
                <NewPositionButton currencyIdA="ETH" />
              </ButtonRow>
            </TitleRow>
            <Flex marginBottom="18px" flexDirection="column" justifyContent="center" alignItems="center">
              <RewardsCard style={{ borderWidth: '3px' }}>
                <AutoColumn gap="md" style={{ width: '100%', padding: '4px' }}>
                  <AutoColumn gap="md">
                    <Flex flexDirection="row" marginBottom="4px" justifyContent="space-between" alignItems="center">
                      <Text color={theme.colors.primaryBright} textAlign="center" fontSize="18px">
                        <Trans>BaseSwap Rewards: </Trans> {t(pendingMerklValue)}
                      </Text>
                      <Button
                        variant="claim"
                        disabled={!rewardData?.hasClaims || isClaiming}
                        onClick={() => {
                          doClaim()
                        }}
                      >
                        <Text>{isClaiming ? t('Claiming..') : t('Claim')}</Text>
                      </Button>
                    </Flex>
                  </AutoColumn>
                  {!rewardsLoading ? (
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingLeft={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={rewardData?.bsxCurrency}
                            size={isMobile ? '40px' : '60px'}
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {pendingMerklBSX}&nbsp; {t(`BSX`)}
                          </Text>
                        </Flex>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingRight={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={rewardData?.xbsxCurrency}
                            size={isMobile ? '40px' : '60px'}
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {pendingMerklXBSX}&nbsp; {t(`xBSX`)}
                          </Text>
                        </Flex>
                      </RowBetween>
                    </AutoColumn>
                  ) : (
                    <Skeleton />
                  )}
                </AutoColumn>

                <Flex justifyContent="center">
                  <img
                    src="https://924174234-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MZrRrYejMtN3SzZU10r%2Fuploads%2Fgit-blob-ed73190eb9c30bd96c439bdb3af22bf91e8446b9%2Fpowered-by-merkl-dark.png?alt=media"
                    alt="Merkl powered by Angle Labs"
                    width="50%"
                    style={{ boxShadow: '0 0 4px #ffff', marginBottom: '8px', borderRadius: '8px' }}
                  />
                </Flex>
              </RewardsCard>
            </Flex>

            <MainContentWrapper>
              {positionsLoading ? (
                <PositionsLoadingPlaceholder />
              ) : filteredPositions && closedPositions && filteredPositions.length > 0 ? (
                <PositionList
                  positions={filteredPositions}
                  setUserHideClosedPositions={setUserHideClosedPositions}
                  userHideClosedPositions={userHideClosedPositions}
                />
              ) : (
                <ErrorContainer>
                  <Text color={theme.colors.tertiary} textAlign="center" marginBottom="1rem">
                    <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
                    <div>
                      <Trans>Your active V3 liquidity positions will appear here.</Trans>
                    </div>
                  </Text>
                  {!showConnectAWallet && closedPositions.length > 0 && (
                    <Button
                      style={{ marginTop: '.5rem' }}
                      onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}
                    >
                      <Text color="#fff">Show closed positions</Text>
                    </Button>
                  )}
                  {showConnectAWallet && <ConnectWalletButton marginBottom="1rem" marginTop="2rem" />}
                </ErrorContainer>
              )}
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </Page>
  )
}
