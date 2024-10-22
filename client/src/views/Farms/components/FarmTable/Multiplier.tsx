import styled from 'styled-components'
import { Text, HelpIcon, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;


  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 14px;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Text color="backgroundAlt">
        {t(
          'The Multiplier represents the proportion of BSWAP rewards each farm receives.',
        )}
      </Text>
      <Text my="24px" color="backgroundAlt">
        {t('For example, if a 1x farm received 1 BSWAP per block, a 10x farm would receive 10 BSWAP per block.')}
      </Text>
      <Text color="backgroundAlt">{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      {/* <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip} */}
    </Container>
  )
}

export default Multiplier
