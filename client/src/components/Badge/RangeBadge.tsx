import { Text } from '@pancakeswap/uikit'
import { AlertTriangle, Slash } from 'react-feather'
import styled, { useTheme } from 'styled-components'

import { MouseoverTooltip } from '../Tooltip'

const BadgeWrapper = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  margin-right: 8px;
`

const ActiveDot = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryBright};
  border-radius: 50%;
  height: 12px;
  width: 12px;
`

const LabelText = styled.div<{ color: string }>`
  align-items: center;
  color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default function RangeBadge({ removed, inRange }: { removed?: boolean; inRange?: boolean }) {
  const theme = useTheme()
  return (
    <BadgeWrapper>
      {removed ? (
        <MouseoverTooltip text={<Text>Your position has 0 liquidity, and is not earning fees.</Text>}>
          <LabelText color={theme.colors.closed}>
            <BadgeText>
              <Text style={{color: theme && theme.colors.closed}}>Closed</Text>
            </BadgeText>
            <Slash width={12} height={12} />
          </LabelText>
        </MouseoverTooltip>
      ) : inRange ? (
        <MouseoverTooltip
          text={
            <Text>The price of this pool is within your selected range. Your position is currently earning fees.</Text>
          }
        >
          <LabelText color={theme.colors.primaryBright}>
            <BadgeText>
              <Text style={{color: theme && theme.colors.primaryBright}}>In Range</Text>
            </BadgeText>
            <ActiveDot />
          </LabelText>
        </MouseoverTooltip>
      ) : (
        <MouseoverTooltip
          text={
            <Text>
              The price of this pool is outside of your selected range. Your position is not currently earning fees.
            </Text>
          }
        >
          <LabelText color={theme.colors.warning}>
            <BadgeText>
              <Text style={{color: theme && theme.colors.warning}}>Out of range</Text>
            </BadgeText>
            <AlertTriangle width={12} height={12} />
          </LabelText>
        </MouseoverTooltip>
      )}
    </BadgeWrapper>
  )
}
