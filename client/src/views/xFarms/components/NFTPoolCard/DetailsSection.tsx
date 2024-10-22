import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from '../types'
import { useTranslation } from '@pancakeswap/localization'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  totalValueFormatted?: string
  removed?: boolean
  lpLabel?: string
  addLiquidityUrl?: string
  isCommunity?: boolean
  auctionHostingEndDate?: string
  farm: FarmWithStakedValue
}

const Wrapper = styled.div`
  margin-top: 12px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 600;
  font-size: 14px;
  color: white;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
  isCommunity,
  auctionHostingEndDate,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <Wrapper>
      {isCommunity && auctionHostingEndDate && (
        <Flex justifyContent="space-between">
          <Text>{t('Auction Hosting Ends')}:</Text>
          <Text>
            {new Date(auctionHostingEndDate).toLocaleString(locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text bold fontSize="14px" color="white">
          {t('TOTAL VALUE LOCKED')}:
        </Text>
        {totalValueFormatted ? (
          <Text fontSize="14px" bold>
            {totalValueFormatted}
          </Text>
        ) : (
          <Skeleton width={75} height={25} />
        )}
      </Flex>
      {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>{t('Get %symbol%', { symbol: lpLabel })}</StyledLinkExternal>
      )}
      <StyledLinkExternal href={bscScanAddress}>{t('View Contract')}</StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
