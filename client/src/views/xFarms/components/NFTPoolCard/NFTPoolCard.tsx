import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '../types'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import DetailsSection from './DetailsSection'
import useNftPools from 'views/xFarms/hooks/useNftPools'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import { StyledPoolCard, StyledPoolCardInnerContainer } from './Styled'
import { getTVLFormatted } from 'views/xFarms/utils'

const ExpandingWrapper = styled.div`
  padding: 8px;
  border-top: 4px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
`

interface NFTPoolCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  stakedOnly: boolean
}

const NFTPoolCard: React.FC<NFTPoolCardProps> = ({ farm, removed, stakedOnly }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { t } = useTranslation()
  const totalValueFormatted = getTVLFormatted(farm?.TVL)
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })

  // const earnLabel = {farm.pid === 1 || farm.pid === 16 ?  'BSWAP + BSX + xBSX':  'BSX + xBSX'}
  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace('PANCAKE', '')
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const lpAddress = getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'BSWAP'

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const { chainId } = useWeb3React()

  const { lpAddresses, nftPoolAddress } = farm

  const { getInitialPoolPosition } = useNftPools()
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const stakedBalance = position?.stakedBalance || BIG_ZERO

  return (stakedOnly && parseInt(stakedBalance.toString()) > 0) || !stakedOnly ? (
    <StyledPoolCard isActive={isPromotedFarm}>
      <StyledPoolCardInnerContainer>
        <CardHeading
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
          isCore={farm.isCore}
          isPartner={farm.isPartner}
          // multiplier={farm.multiplier}
        />
        {!removed && (
          <Flex justifyContent="flex-end" alignItems="center">
            <Text fontSize="24px" style={{ display: 'flex', alignItems: 'flex-end' }}>
              {farm.apr ? (
                <span>{`${Number(Number(farm.apr).toFixed(2)).toLocaleString()}% APR`}</span>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}

        <Flex justifyContent="flex-end">
          <Text fontSize="12px">
            {t('EARNING')}:&nbsp;
            {farm.pid === 1 || farm.pid === 16 ? 'BSWAP + BSX + xBSX' : 'BSX + xBSX'}
          </Text>
        </Flex>
        <CardActionsContainer farm={farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} />
      </StyledPoolCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
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
        )}
      </ExpandingWrapper>
    </StyledPoolCard>
  ) : null
}

export default NFTPoolCard
