/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Spinner, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import { ViewMode } from 'state/user/actions'
import Page from 'views/Page'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import orderBy from 'lodash/orderBy'
import { latinise } from 'utils/latinise'
import { useRouter } from 'next/router'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { FarmWithStakedValue } from './components/types'
import { useMatchBreakpoints, Toggle } from '@pancakeswap/uikit'
import { getSortedFarmsLP } from './utils'
import { getXFarmApr } from 'utils/apr'
import { useNftPoolsFarms } from 'state/xFarms/hooks'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import TypeIt from 'typeit-react'
import 'animate.css'
import ToggleView from 'components/ToggleView/ToggleView'
import { priceDexScreener } from 'utils/tokenPricing'
import { BIG_ZERO } from 'utils/bigNumber'

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
`
const ShowMe = styled(Flex)`
  position: absolute;
  bottom: 59px;
  z-index: 1000;
  @media (min-width: 768px) {
    bottom: 5px;
  }
`

interface TextProps {
  isMobile: boolean
  fontWeight?: number
  marginBottom?: string
}

const ControlContainer = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;
  display: none;
  > div {
    padding: 8px 0px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: flex-start;
    width: auto;
    display: flex;
    > div {
      padding: 0;
    }
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12
const Farms: React.FC = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { account, chainId } = useWeb3React()
  const { arxPerSec, WETHPerSec, farms: farmsLP } = useNftPoolsFarms()
  const { t } = useTranslation()
  const [WETHPrice, SETWETHPrice] = useState<BigNumber>(BIG_ZERO)
  const [cakePrice, SETCAKEPrice] = useState<BigNumber>(BIG_ZERO)
  useEffect(() => {
    const fetchData = async () => {
      const price = await priceDexScreener('0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9')
      SETWETHPrice(price)
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      const price = await priceDexScreener('0xd5046b976188eb40f6de40fb527f89c05b323385')
      SETCAKEPrice(price)
    }
    fetchData()
  }, [])

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query
  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived
  const sortedFarmsLP = farmsLP
  const [stakedOnlyState, setStakedOnlyState] = useState(localStorage?.getItem('stakedOnlyFarms') === 'true')
  const setStakedOnly = () => {
    const stakedOnly = localStorage?.getItem('stakedOnlyFarms') === 'true'
    if (stakedOnly) {
      localStorage.setItem('stakedOnlyFarms', 'false')
      setStakedOnlyState(false)
    } else {
      localStorage.setItem('stakedOnlyFarms', 'true')
      setStakedOnlyState(true)
    }
  }
  const inactiveFarms = sortedFarmsLP.filter((farm) => farm.pid === 9 || farm.pid === 2)
  const inactiveFarmPids = inactiveFarms.map((farm) => farm.pid)
  const activeFarms = sortedFarmsLP.filter((farm) => !inactiveFarmPids.includes(farm.pid))
  const archivedFarms = sortedFarmsLP
  const [showInactive, setShowInactive] = useState(false)

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.TVL || 1)
        const arxPoolWeight = new BigNumber(farm.arxPoolWeight || 0)
        const WETHPoolWeight = new BigNumber(farm.WETHPoolWeight || 0)
        const { cakeRewardsApr } = isActive
          ? getXFarmApr(arxPoolWeight, WETHPoolWeight, cakePrice, WETHPrice, totalLiquidity, arxPerSec, WETHPerSec)
          : { cakeRewardsApr: 0 }
        return { ...farm, apr: cakeRewardsApr, liquidity: totalLiquidity }
      })
      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive, arxPerSec, WETHPerSec, WETHPrice, farmsLP],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const { isMobile } = useMatchBreakpoints()
  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }
  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        default:
          return farms
      }
    }
    if (isActive) {
      chosenFarms = farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = farmsList(archivedFarms)
    }
    if (showInactive) {
      chosenFarms = farmsList(inactiveFarms)
    } else {
      chosenFarms = farmsList(activeFarms)
    }
    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    numberOfFarmsVisible,
    farmsLP,
  ])
  chosenFarmsLength.current = chosenFarmsMemoized.length

  return (
    <FarmsContext.Provider value={{ chosenFarmsMemoized, viewMode, stakedOnlyState }}>
      <Page style={{ position: 'relative' }}>
        <WelcomeTypeIt
          options={{
            cursorChar: ' ',
            cursorSpeed: 1000000,
            speed: 75,
          }}
          speed={10}
          getBeforeInit={(instance) => {
            instance.type('FARMS', { speed: 5000 })
            return instance
          }}
        />

        {!account ? (
          <ConnectWalletButton />
        ) : (
          <>
            <ControlContainer>
              <ViewControls>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  CHOOSE YOUR &nbsp; <span style={{ textDecoration: 'line-through' }}>FIGHTER</span>
                  &nbsp;VIEW MODE:
                </Text>
                <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
                <ToggleWrapper>
                  <Toggle
                    id="staked-only-farms"
                    checked={stakedOnlyState}
                    onChange={() => setStakedOnly()}
                    scale="sm"
                  />
                  <Text> {t('Staked only')}</Text>
                </ToggleWrapper>
                {/* <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} /> */}
              </ViewControls>
              <FilterContainer>
                <LabelWrapper>
                  <Text textTransform="uppercase">{t('Sort by')}</Text>
                  <Select
                    options={[
                      {
                        label: t('Hot'),
                        value: 'hot',
                      },
                      {
                        label: t('APR'),
                        value: 'apr',
                      },

                      {
                        label: t('Liquidity'),
                        value: 'liquidity',
                      },
                      {
                        label: t('Latest'),
                        value: 'latest',
                      },
                    ]}
                    onOptionChange={handleSortOptionChange}
                  />
                </LabelWrapper>
                {/* <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase">{t('Search')}</Text>
              <SearchInput
                initialValue={normalizedUrlSearch}
                onChange={handleChangeQuery}
                placeholder="Search Farms"
              />
            </LabelWrapper> */}
              </FilterContainer>
            </ControlContainer>
            <FlexLayout className="animate__animated animate__faster animate__fadeInUp">{children}</FlexLayout>
            {account && !farmsLP.length && (
              <Flex alignItems="flex-start" justifyContent="flex-start">
                <Spinner />
              </Flex>
            )}
            <div ref={observerRef} />
          </>
        )}
        <Flex
          alignItems="flex-end"
          justifyContent="flex-end"
          marginTop="1rem"
          marginBottom={isMobile ? '1rem' : '0rem'}
        >
          <Button onClick={() => setShowInactive((prev) => !prev)}>
            {showInactive ? 'Show Active Farms' : 'Show Inactive Farms'}
          </Button>
        </Flex>
      </Page>
    </FarmsContext.Provider>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [], viewMode: ViewMode.CARD, stakedOnlyState: false })
export default Farms
