import { ChainId, SUPPORTED_CHAINS } from '@baseswapfi/sdk-core'
import { FeeAmount } from '@baseswapfi/v3-sdk2'
import Trans from 'components/Trans'
import type { ReactNode } from 'react'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmount,
  { label: string; description: ReactNode; supportedChains: readonly ChainId[] }
> = {
  [FeeAmount.LOWEST]: {
    label: '0.008',
    description: <Trans>Best for very stable pairs.</Trans>,
    supportedChains: [
      // ChainId.ARBITRUM_ONE,
      // ChainId.BNB,
      // ChainId.CELO,
      // ChainId.CELO_ALFAJORES,
      // ChainId.MAINNET,
      // ChainId.OPTIMISM,
      // ChainId.POLYGON,
      // ChainId.POLYGON_MUMBAI,
      // ChainId.AVALANCHE,
      ChainId.BASE,
      ChainId.BASE_GOERLI,
    ],
  },
  [FeeAmount.LOW]: {
    label: '0.045',
    description: <Trans>Best for stable pairs.</Trans>,
    supportedChains: SUPPORTED_CHAINS,
  },
  [FeeAmount.MEDIUM]: {
    label: '0.25',
    description: <Trans>Best for most pairs.</Trans>,
    supportedChains: SUPPORTED_CHAINS,
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: <Trans>Best for exotic pairs.</Trans>,
    supportedChains: SUPPORTED_CHAINS,
  },
}
