import { Flex, Spinner, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getTokenInstance } from 'config/constants/token-info'
import Page from 'views/Page'
import PageHeader from 'components/PageHeader'
import { PoolCardActionProps } from 'views/xFarms/components/types'
import TypeIt from 'typeit-react'
import 'animate.css'
import { getTVLFormatted } from 'views/xFarms/utils'
import PoolCard from './components/PoolCard'
import { useMemo } from 'react'
import { useSelectMerklPools } from 'state/user/selectors'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'

const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: center;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 48px;
  }
`

export default function PoolV3({ table }: PoolCardActionProps) {
  const isMobile = useMatchBreakpoints()
  const merklPools = useSelectMerklPools()
  useMerklRewards()

  const pools = useMemo(() => {
    return (merklPools || []).map((p) => {
      const feeAmount = p.poolFee * 10000
      return {
        ...p,
        feeAmount,
        token: getTokenInstance(p.token0),
        quoteToken: getTokenInstance(p.token1),
        tvl: getTVLFormatted(p.tvl),
      }
    })
  }, [merklPools])

  return (
    <Page>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <WelcomeTypeIt
              options={{
                cursorChar: ' ',
                cursorSpeed: 1000000,
                speed: 25,
              }}
              speed={10}
              getBeforeInit={(instance) => {
                instance.type('CONCENTRATED')
                return instance
              }}
            ></WelcomeTypeIt>
            <WelcomeTypeIt
              options={{
                cursorChar: ' ',
                cursorSpeed: 1000000,
                speed: 50,
              }}
              speed={10}
              getBeforeInit={(instance) => {
                instance.type('FARMS')
                return instance
              }}
            ></WelcomeTypeIt>
          </Flex>
        </Flex>
      </PageHeader>
      <Flex>
        {pools?.length > 0 ? (
          pools.map((p) => {
            return <PoolCard key={p.pool} p={p} table={table} />
          })
        ) : (
          <Spinner />
        )}
      </Flex>
    </Page>
  )
}
