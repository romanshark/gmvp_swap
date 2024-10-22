import styled from 'styled-components'
import { Flex, Heading, Tag, Text } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@magikswap/sdk'
import { FarmAuctionTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  token: Token
  quoteToken: Token
  quantum?: boolean
  classic?: boolean
  narrow?: boolean
  wide?: boolean
  isNew?: boolean
  stable?: boolean
  isCore?: boolean
  isCommunityFarm?: boolean
  isStable?: boolean 
  isBluechip?: boolean
  isPartner?: boolean
  earnLabel?: string
}

const Wrapper = styled(Flex)`
  min-width: 300px;
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeadingTable: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  token,
  quoteToken,
  quantum,
  classic,
  narrow,
  wide,
  isNew,
  multiplier,
  earnLabel,
  stable,
  isCore,
  isCommunityFarm,
  isStable, 
  isBluechip, 
}) => {
  const { t } = useTranslation()

  let quantumText = ''
  if (quantum && wide) {
    quantumText = 'WIDE'
  } else if (quantum && narrow) {
    quantumText = 'NARROW'
  } else if (quantum && stable) {
    quantumText = 'STABLE'
  } else if (classic && isCore) {
    quantumText = 'BASESWAP'
  }

  // add in stable props

  return (
    <Wrapper justifyContent="flex-start" alignItems="center" mb="12px" mr="60px" minWidth="400px">
      <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      <Flex flexDirection="column">
        <Flex>
          <Heading mx="12px">{lpLabel.split(' ')[0]}</Heading>
          <Flex justifyContent="center">{isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}</Flex>
        </Flex>
        {earnLabel && <Flex justifyContent="flex-start" mt="4px" ml="20px">
          <Text>{t('Earn')}:</Text>
          <Text bold>{earnLabel}</Text>
        </Flex>}
      </Flex>

    </Wrapper>
  )
}

export default CardHeadingTable
