import { Percent } from '@baseswapfi/sdk-core'
import { ReactNode } from 'react'
import { ArrowLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import { Box } from 'rebass'
import { useAppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import { resetMintState as resetMintV3State } from 'state/mint/v3/actions'
import styled, { useTheme } from 'styled-components'

import { RowBetween } from '../Row'
// import SettingsTab from '../Settings'
import { Heading, Text, flexRowNoWrap } from '@pancakeswap/uikit'
import Trans from 'components/Trans'
import { useRouter } from 'next/router'

const Tabs = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

// const StyledLink = styled(Link)<{ flex?: string }>`
//   flex: ${({ flex }) => flex ?? 'none'};

//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
//     flex: none;
//     margin-right: 10px;
//   `};
// `
const StyledLink = styled(Link)<{ flex?: string }>`
  flex: ${({ flex }) => flex ?? 'none'};
`

const FindPoolTabsText = styled(Heading)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.colors.primary};
`

export function FindPoolTabs({ origin }: { origin: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem', position: 'relative' }}>
        <Link to={origin}>
          <StyledArrowLeft />
        </Link>
        <FindPoolTabsText>
          <Trans>Import V2 Pool</Trans>
        </FindPoolTabsText>
      </RowBetween>
    </Tabs>
  )
}

const AddRemoveTitleText = styled(Text)`
  flex: 1;
  margin: auto;
`

export function AddRemoveTabs({
  adding,
  creating,
  autoSlippage,
  positionID,
  children,
}: {
  adding: boolean
  creating: boolean
  autoSlippage: Percent
  positionID?: string
  showBackLink?: boolean
  children?: ReactNode
}) {
  const theme = useTheme()
  // reset states on back
  const dispatch = useAppDispatch()
  const router = useRouter()

  // detect if back should redirect to v3 or v2 pool page
  const poolLink = router.pathname.includes('add/v2')
    ? '/pools/v2'
    : '/pools' + (positionID ? `/${positionID.toString()}` : '')

  // return (
  //   <Tabs>
  //     <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
  //       <StyledLink
  //         to={poolLink}
  //         onClick={() => {
  //           if (adding) {
  //             // not 100% sure both of these are needed
  //             dispatch(resetMintState())
  //             dispatch(resetMintV3State())
  //           }
  //         }}
  //         flex={children ? '1' : undefined}
  //       >
  //         <StyledArrowLeft stroke={theme.colors.secondary} />
  //       </StyledLink>
  //       <AddRemoveTitleText textAlign={children ? 'start' : 'center'}>
  //         {creating ? (
  //           <Trans>Create a pair</Trans>
  //         ) : adding ? (
  //           <Trans>Add Liquidity</Trans>
  //         ) : (
  //           <Trans>Remove Liquidity</Trans>
  //         )}
  //       </AddRemoveTitleText>
  //       {children && <Box style={{ marginRight: '.5rem' }}>{children}</Box>}

  //       {/* <SettingsTab autoSlippage={autoSlippage} chainId={chainId} /> */}
  //     </RowBetween>
  //   </Tabs>
  // )

  return <></>
}
