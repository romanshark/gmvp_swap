import { useState, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { BigNumber } from 'bignumber.js'
import useTokenPrices from 'hooks/useTokenPrices'
import { Card, Flex, Text, Skeleton, TokenImage } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import { getTokenAddress, getTokenImage, getTokenInstance } from 'config/constants/token-info'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '../types'
import CardHeadingTable from './CardHeadingTable'
import CardActionsContainer from './CardActionsContainer'
import DetailsSection from './DetailsSection'
import useNftPools from 'views/xFarms/hooks/useNftPools'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface ExpandingWrapperProps {
  expanded: boolean;
}

const StyledCard = styled(Card)`
  align-self: baseline;
  min-width: 100% !important;
  max-width: 100% !important;
  margin: 0 0 0px 0 !important;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 90% !important;
    max-width: 90% !important;
    margin: 0 0 0px 0 !important;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 90% !important;
    width: 100% !important;
    margin: 0 0 0px 0 !important;
  }
`

const NFTPoolCardInnerContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0px;
`
const NFTPoolCardOuterContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 8px;
`

const ExpandingWrapper = styled.div<ExpandingWrapperProps>`
${({ expanded }) =>
    expanded
      ? css`
      padding: 24px;
      border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
    `
      : css`
      padding: 0;
    `}
  overflow: hidden;
`

interface NFTPoolCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  stakedOnly: boolean
}

const NFTPoolCardTable: React.FC<NFTPoolCardProps> = ({ farm, removed, stakedOnly }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { t } = useTranslation()
  const totalValueFormatted = `~$${(farm?.TVL || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const { getValueForAmount } = useTokenPrices()

  const earnLabel = t('BSWAP')
  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace('PANCAKE', '')
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const lpAddress = getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'BSWAP'

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const { chainId } = useWeb3React()

  const { lpAddresses, nftPoolAddress, sharePrice, lpTotalSupply, lpPrice, tokenAmountTotal, quoteTokenAmountTotal, token, quoteToken } = farm

  const { getInitialPoolPosition } = useNftPools()
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const stakedBalance = position?.stakedBalance || BIG_ZERO

  let rewardsList = []
  // if (nitro) {
  //   rewardsList = position?.nitroUserInfo?.pendingNitroRewards || []
  // } else {
  rewardsList = position?.pendingRewards || []
  // }

  const xTokenAddress = useMemo(() => getTokenAddress('xProtocolToken', chainId), [chainId])
  const arxAddress = useMemo(() => getTokenAddress('ProtocolToken', chainId), [chainId])
  const bswapAddress = useMemo(() => getTokenAddress('BSWAP', chainId), [chainId])

  let hasRewards = false

  const mappedRewards = rewardsList.map((rw) => {
    const tokenAddress = rw.token == xTokenAddress ? arxAddress : rw.token
    const { valueLabel } = getValueForAmount(tokenAddress, rw.pendingReward)
    const rewardAmountDisplay = rw.pendingReward.toFixed(4)

    if (parseFloat(rw.pendingReward) > 0) hasRewards = true

    return {
      ...rw,
      imgSrc: getTokenImage(rw.token),
      rewardAmountDisplay,
      valueLabel,
      token: getTokenInstance(rw.token),
    }
  })

  return (stakedOnly && parseInt(stakedBalance.toString()) > 0) || !stakedOnly ? (
    <StyledCard isActive={isPromotedFarm}>
      <NFTPoolCardOuterContainer>
        <NFTPoolCardInnerContainer>
          <CardHeadingTable
            lpLabel={lpLabel}
            token={farm.token}
            quoteToken={farm.quoteToken}
            quantum={farm.quantum}
            isNew={farm.isNew}
            narrow={farm.narrow}
            classic={farm.classic}
            wide={farm.wide}
            isStable={farm.isStable}
            isBluechip={farm.isBluechip}
            isPartner={farm.isPartner}
            isCore={farm.isCore}
            earnLabel={farm.pid === 1 || farm.pid === 16 ?  'BSWAP + BSX + xBSX':  'BSX + xBSX'}
          // multiplier={farm.multiplier}
          />
          {!removed && (
            <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start" mr="60px">
              <Text>{t('APR')}:</Text>
              <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                {farm.apr ? (
                  <span>{`${Number(Number(farm.apr).toFixed(2)).toLocaleString()}%`}</span>
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </Flex>
          )}
          {new BigNumber(stakedBalance).gt(0) && new BigNumber(lpPrice).gt(0) && (
            <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start" mr="60px">

              <Text bold textTransform="uppercase" color="white">
                {t('STAKED BALANCE')}
              </Text>
              <Balance
                color="textSubtle"
                decimals={2}
                value={
                  sharePrice
                    ? getBalanceNumber(new BigNumber(sharePrice).times(stakedBalance))
                    : getBalanceNumber(new BigNumber(lpPrice).times(stakedBalance))
                }
                unit=" USD"
                prefix="~"
              />
              <Flex style={{ gap: '4px' }}>
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={4}
                  value={new BigNumber(stakedBalance).div(1e18).div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
                  unit={` ${token.symbol}`}
                />
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={4}
                  value={new BigNumber(stakedBalance).div(1e18).div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
                  unit={` ${quoteToken.symbol}`}
                />
              </Flex>
            </Flex>
          )}
          {mappedRewards.length > 0 &&
            <Flex flexDirection="row">
              <Flex flexDirection="row" alignItems="flex-start">
                {mappedRewards.map((rw, i) => (
                  <Flex key={i} alignItems="center" justifyContent="flex-start" mt="0px" ml="1px" width="100%">
                    <TokenImage src={rw.imgSrc} width={30} height={30} mr="10px" />

                    <Flex flexDirection="column" alignItems="flex-start">
                      <Text bold textTransform="uppercase" color="white">
                        {rw.token.symbol} {t('Earned')}
                      </Text>
                      <Text fontSize="14px" color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>
                        {rw.rewardAmountDisplay}
                      </Text>
                      <Text fontSize="10px" color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>
                        {rw.valueLabel}
                      </Text>

                      {/* <Text color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>{rw.rewardAmountDisplay}</Text>
              <Text color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>{rw.valueLabel}</Text> */}
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>}


        </NFTPoolCardInnerContainer>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
      </NFTPoolCardOuterContainer>

      <ExpandingWrapper expanded={showExpandableSection}>
        {showExpandableSection && (
          <>
            <CardActionsContainer farm={farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} table />
            <DetailsSection
              removed={removed}
              totalValueFormatted={totalValueFormatted}
              bscScanAddress={getBscScanLink(lpAddress, 'address')}
              infoAddress={`/info/pool/${lpAddress}`}
              lpLabel={lpLabel}
              addLiquidityUrl={addLiquidityUrl}
              auctionHostingEndDate={farm.auctionHostingEndDate}
              farm={farm}
            />
          </>
        )}
      </ExpandingWrapper>
    </StyledCard>
  ) : null
}

export default NFTPoolCardTable
