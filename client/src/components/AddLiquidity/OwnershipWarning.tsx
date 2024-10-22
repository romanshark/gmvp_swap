// import { useTranslation } from '@pancakeswap/localization'
import { Heading } from '@pancakeswap/uikit'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'

const ExplainerText = styled.div``
const TitleRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  margin-top: 12px;
  max-width: 480px;
  padding: 12px 20px;
  width: 100%;
`

interface OwnershipWarningProps {
  ownerAddress: string
}

const OwnershipWarning = ({ ownerAddress }: OwnershipWarningProps) => {
  // const { t } = useTranslation()

  return (
    <Wrapper>
      <TitleRow>
        <AlertTriangle style={{ marginRight: '8px' }} />
        <Heading color="accentWarning">Warning</Heading>
      </TitleRow>
      <ExplainerText>
        You are not the owner of this LP position. You will not be able to withdraw the liquidity from this position
        unless you own the following address: {ownerAddress}
      </ExplainerText>
    </Wrapper>
  )
}

export default OwnershipWarning
