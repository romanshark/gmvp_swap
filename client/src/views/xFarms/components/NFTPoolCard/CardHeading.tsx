import styled from 'styled-components'
import { Flex, Heading, Tag, Skeleton } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@magikswap/sdk'
import { StableTag, CoreTag, PartnerTag, BluechipTag } from 'components/Tags'

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
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  token,
  quoteToken,
  quantum,
  classic,
  narrow,
  wide,
  isNew,
  multiplier,
  stable,
  isCore,
  isCommunityFarm,
  isStable, 
  isBluechip, 
  isPartner
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
    <Wrapper justifyContent="space-between" alignItems="flex-start" mb="-10px">

      <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={80} height={80} />

      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCore ? 
                (  <CoreTag /> ) 
          : isStable ? 
                ( <StableTag /> ) 
          : isPartner ? 
                ( <PartnerTag /> )  
          : isBluechip ? 
                ( <BluechipTag /> ) 
          : 
          (   <div /> )
          
          }
        </Flex>
        {/* {multiplier ? (
            <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )} */}

        {/* <MultiplierTag variant="secondary">{multiplier}</MultiplierTag> */}
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
