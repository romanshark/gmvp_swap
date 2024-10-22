import { Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useXTokenInfo } from 'state/xToken/hooks'
import styled from 'styled-components'
import VestingInfoCard from './VestingInfoCard'

interface TextProps {
  isMobile: boolean
}
export const VestingContainer = styled(Card)`
  min-width: 400px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  margin-bottom: 12px;
  display: flex;
  width: 100%; 
  padding: 0.5rem;
  border: 2px solid #fff; 
  }
`

const CardTitle = styled.div<TextProps>`
  color: #0154FD;
  font-size: ${(props) => (props.isMobile ? '1.8rem' : '2.5rem')};
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: ${(props) => (props.isMobile ? '0.5rem' : '0.5rem')};
  margin-top: 0.2rem;

`

const VestingInfo: React.FC = () => {
  const { redemptionInfo } = useXTokenInfo()
  const { isMobile } = useMatchBreakpoints()
  const sortedVestingList = [...redemptionInfo.vestingList].sort((a, b) => {
    const dateA = new Date(a.endTime).getTime();
    const dateB = new Date(b.endTime).getTime();
    return dateA - dateB;
});
redemptionInfo.vestingList.forEach(vesting => console.log(vesting.endTime));


  return (
    <VestingContainer>
      <CardTitle isMobile={isMobile}>Vesting Underway</CardTitle>

      {sortedVestingList.map((vesting) => {
        return <VestingInfoCard key={vesting.endTime} vesting={vesting} />
      })}
    </VestingContainer>
  )
}

export default VestingInfo
