import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text, Link } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from '@pancakeswap/localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import { OptionProps } from 'components/Select/Select'
import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import Loading from 'components/Loading'
import { useInitialBlock } from 'state/block/hooks'
import { BSC_BLOCK_TIME } from 'config'
import PageTitle from 'components/PageTitle/PageTitle'
import Page from 'views/Page'
import PoolTabButtons from './components/PoolTabButtons'
import PoolCard from './components/PoolCard'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getCakeVaultEarnings } from './helpers'
import TypeIt from 'typeit-react'
import 'animate.css'
import { serializedTokens } from 'config/constants/farms'


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


const Sub = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left; 
  letter-spacing: 2px; 
  margin-bottom: 12px;
  text-transform: uppercase; 
  font-size: 14px; 
  @media (min-width: 768px) {
    font-size: 20px; 
  }
`;

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  position: relative;

  justify-content: center;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 16px;
    margin-bottom: 0;
  }
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const NUMBER_OF_POOLS_VISIBLE = 12

const sortPools = (account: string, sortOption: string, pools: DeserializedPool[], poolsToSort: DeserializedPool[]) => {
  switch (sortOption) {
    case 'apr':
      // Ternary is needed to prevent pools without APR (like MIX) getting top spot
      return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.apr : 0), 'desc')
    case 'earned':
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          if (!pool.userData || !pool.earningTokenPrice) {
            return 0
          }

          if (pool.vaultKey) {
            const { userData, pricePerFullShare } = pool as DeserializedPoolVault
            if (!userData || !userData.userShares) {
              return 0
            }
            return getCakeVaultEarnings(
              account,
              userData.cakeAtLastUserAction,
              userData.userShares,
              pricePerFullShare,
              pool.earningTokenPrice,
              pool.vaultKey === VaultKey.CakeVault
                ? (pool as DeserializedPoolLockedVault).userData.currentPerformanceFee.plus(
                    (pool as DeserializedPoolLockedVault).userData.currentOverdueFee,
                  )
                : null,
            ).autoUsdToDisplay
          }
          return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
        },
        'desc',
      )
    case 'totalStaked': {
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          let totalStaked = Number.NaN
          if (pool.vaultKey) {
            const vault = pool as DeserializedPoolVault
            if (pool.stakingTokenPrice && vault.totalCakeInVault.isFinite()) {
              totalStaked =
                +formatUnits(EthersBigNumber.from(vault.totalCakeInVault.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
          } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
            totalStaked =
              +formatUnits(EthersBigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
              pool.stakingTokenPrice
          }
          return Number.isFinite(totalStaked) ? totalStaked : 0
        },
        'desc',
      )
    }
    case 'latest':
      return orderBy(poolsToSort, (pool: DeserializedPool) => Number(pool.sousId), 'desc')
    default:
      return poolsToSort
  }
}

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

const Pools: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePoolsWithVault()
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === 'string' ? router.query.search : ''),
    [router.query],
  )
  const [_searchQuery, setSearchQuery] = useState('')
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const initialBlock = useInitialBlock()

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        initialBlock > 0 && pool.startBlock
          ? Number(pool.startBlock) < initialBlock + POOL_START_BLOCK_THRESHOLD
          : true,
      ),
    [initialBlock, openPools],
  )
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          const vault = pool as DeserializedPoolVault
          return vault.userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool as DeserializedPoolVault
        return vault.userData.userShares.gt(0)
      }
      return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
    })
  }, [openPoolsWithStartBlockFilter])
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePoolsPageFetch()

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])
  const showFinishedPools = router.pathname.includes('history')

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), [])

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools(account, sortOption, pools, chosenPools).slice(0, numberOfPoolsVisible)

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      return sortedPools.filter((pool) => latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery))
    }
    return sortedPools
  }, [account, sortOption, pools, chosenPools, numberOfPoolsVisible, searchQuery])
  chosenPoolsLength.current = chosenPools.length

  const bsxpools = chosenPools.filter((pool) => pool.sousId === 104 || pool.sousId === 103 || pool.sousId === 102);
  const bswappools = chosenPools.filter((pool) => pool.sousId === 100 || pool.sousId === 101);
  const xbsxpools = chosenPools.filter((pool) => pool.sousId === 105);

  const otherPools = chosenPools.filter((pool) => pool.sousId !== 104 && pool.sousId !== 103);
  
  const cardLayout = (
    // <Flex flexDirection="column">
    //   <Text color="background" fontSize="3rem" fontWeight="500" textAlign="center">BSX!</Text>
    //     <CardLayout>
          
    //         {bsxpools.map((pool) => (
    //         <PoolCard key={pool.sousId} pool={pool} account={account} />
    //       ))}
    //     </CardLayout>
    //     <Text color="background" fontSize="3rem" fontWeight="500" textAlign="center">BSWAP!</Text>
    //     <CardLayout>
    //           {bswappools.map((pool) => (
    //           <PoolCard key={pool.sousId} pool={pool} account={account} />
    //         ))}
    //       </CardLayout>
    //       <Text color="background" fontSize="3rem" fontWeight="500" textAlign="center">xBSX!</Text>

    //       <CardLayout>
          
    //       {xbsxpools.map((pool) => (
    //       <PoolCard key={pool.sousId} pool={pool} account={account} />
    //     ))}
    //   </CardLayout>
    // </Flex>
    <CardLayout>
    {chosenPools.map(
      (pool) => (
        // pool.vaultKey ? (
        //   <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
        // ) : (
        <PoolCard key={pool.sousId} pool={pool} account={account} showStakedOnly={stakedOnly}/>
      ),
      // ),
    )}
    </CardLayout>
  )


  const tableLayout = <PoolsTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />

  return (
    <>
      {/* <PageTitle title="Earn" /> */}

      <Page>
      <WelcomeTypeIt 
          options={{
            cursorChar:" ", 
            cursorSpeed:1000000, speed: 75, 
          }}
          speed={10}
          getBeforeInit={(instance) => {
        instance

            .type("EARN", {speed: 200})
            ;
        return instance;
         }}> 
         </WelcomeTypeIt>
         {/* <Sub 
          options={{
            cursorChar:" ", 
            cursorSpeed:1000000, 
          }}
          speed={100}
          getBeforeInit={(instance) => {
        instance

            .type("Stake BSWAP to earn bluechip tokens", {speed: 1000})
            ;
        return instance;
         }}> 
         </Sub> */}
        <Heading className="animate__animated animate__fadeInLeft animate__delay-1s">
          Stake BSX, BSWAP, and xBSX to earn bluechips!</Heading>
        <PoolControls>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </PoolControls>
        {showFinishedPools && (
          <FinishedTextContainer>
            <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
              {t('Looking for v1 BSWAP syrup pools? They do not exist!')}
            </Text>
            <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
              {t('Go to migration page')}.
            </FinishedTextLink>
          </FinishedTextContainer>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
      </Page>
    </>
  )
}

export default Pools
