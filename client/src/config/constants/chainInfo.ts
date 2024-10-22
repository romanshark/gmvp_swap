import ms from 'ms'
import { SupportedL1ChainId, SupportedL2ChainId } from './chains'
import { ChainId } from '@baseswapfi/sdk-core'
import { BASE_LIST } from './lists'

export const AVERAGE_L1_BLOCK_TIME = ms(`12s`)

export enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly explorer: string
  readonly infoLink: string
  readonly logoUrl?: string
  readonly circleLogoUrl?: string
  readonly squareLogoUrl?: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
  readonly color?: string
  readonly backgroundColor?: string
}

interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
  readonly defaultListUrl?: string
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
  readonly bridge: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

const CHAIN_INFO: ChainInfoMap = {
  [ChainId.BASE]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: ms(`25m`),
    bridge: 'https://bridge.base.org/deposit',
    defaultListUrl: BASE_LIST,
    docs: 'https://docs.base.org',
    explorer: 'https://basescan.org/',
    infoLink: 'https://info.uniswap.org/#/base/',
    label: 'Base',
    // logoUrl: baseLogo,
    statusPage: 'https://status.base.org/',
    // circleLogoUrl: baseLogo,
    // squareLogoUrl: baseSquareLogo,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    // color: darkTheme.chain_84531,
  },
  [ChainId.BASE_GOERLI]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: ms(`25m`),
    bridge: 'https://goerli-bridge.base.org/deposit',
    defaultListUrl: BASE_LIST,
    docs: 'https://docs.base.org',
    explorer: 'https://goerli.basescan.org/',
    infoLink: 'https://info.uniswap.org/#/base/', // base testnet not supported
    label: 'Base Goerli',
    //  logoUrl: baseLogo,
    statusPage: 'https://status.base.org/',
    // circleLogoUrl: baseLogo,
    // squareLogoUrl: baseSquareLogo,
    nativeCurrency: { name: 'Base Goerli Ether', symbol: 'ETH', decimals: 18 },
    // color: darkTheme.chain_84531,
  },
} as const

export function getChainInfo(
  chainId: SupportedL1ChainId,
  featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>,
): L1ChainInfo
export function getChainInfo(
  chainId: SupportedL2ChainId,
  featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>,
): L2ChainInfo
export function getChainInfo(
  chainId: ChainId,
  featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>,
): L1ChainInfo | L2ChainInfo
export function getChainInfo(
  chainId: ChainId | SupportedL1ChainId | SupportedL2ChainId | number | undefined,
  featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>,
): L1ChainInfo | L2ChainInfo | undefined

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * ChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(
  chainId: any,
  featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>,
): any {
  if (featureFlags && chainId in featureFlags) {
    return featureFlags[chainId] ? CHAIN_INFO[chainId] : undefined
  }
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined
  }
  return undefined
}

export function getChainInfoOrDefault(chainId: number | undefined, featureFlags?: Record<number, boolean>) {
  return getChainInfo(chainId, featureFlags) ?? CHAIN_INFO[ChainId.BASE]
}
