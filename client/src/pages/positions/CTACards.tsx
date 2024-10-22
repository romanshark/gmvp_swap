import { Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { AutoColumn } from 'components/Column'
import Trans from 'components/Trans'
import { getChainInfoOrDefault } from 'config/constants/chainInfo'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'

// const CTASection = styled.section`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 8px;
//   opacity: 0.8;

//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
//     grid-template-columns: auto;
//     grid-template-rows: auto;
//   `};
// `

const CTASection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  opacity: 0.8;
`

const CTA = styled(ExternalLink)`
  padding: 16px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};

  * {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none !important;
  }

  :hover {
    border: 1px solid ${({ theme }) => theme.colors.primary};

    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }
`

// const HeaderText = styled(ThemedText.DeprecatedLabel)`
//   align-items: center;
//   display: flex;

//   font-weight: 400;
//   font-size: 16px;
//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
//     font-size: 16px;
//   `};
// `

const HeaderText = styled(Text)`
  align-items: center;
  display: flex;

  font-weight: 400;
  font-size: 16px;
`

// const ResponsiveColumn = styled(AutoColumn)`
//   grid-template-columns: 1fr;
//   width: 100%;
//   gap: 8px;

//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
//     gap: 8px;
//   `};
//   justify-content: space-between;
// `

const ResponsiveColumn = styled(AutoColumn)`
  grid-template-columns: 1fr;
  width: 100%;
  gap: 8px;
  justify-content: space-between;
`

export default function CTACards() {
  const { chainId } = useWeb3React()
  const { infoLink } = getChainInfoOrDefault(chainId)

  return (
    <CTASection>
      <CTA href="https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-">
        <ResponsiveColumn>
          <HeaderText>
            <Trans>Learn about providing liquidity</Trans> ↗
          </HeaderText>
          <Text fontWeight={400} style={{ alignItems: 'center', display: 'flex' }}>
            <Trans>Check out our v3 LP walkthrough and migration guides.</Trans>
          </Text>
        </ResponsiveColumn>
      </CTA>
      <CTA data-testid="cta-infolink" href={infoLink + 'pools'}>
        <ResponsiveColumn>
          <HeaderText style={{ alignSelf: 'flex-start' }}>
            <Trans>Top pools</Trans> ↗
          </HeaderText>
          <Text fontWeight={400} style={{ alignSelf: 'flex-start' }}>
            <Trans>Explore Uniswap Analytics.</Trans>
          </Text>
        </ResponsiveColumn>
      </CTA>
    </CTASection>
  )
}
