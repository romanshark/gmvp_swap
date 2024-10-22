import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { TOKENS_CHAIN_MAP } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'
import { ChainId } from '../../../packages/swap-sdk/src/constants'

// const serializedTokens = serializeTokens(bscTokens)
const serializedTokens = serializeTokens(TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID])

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto CAKE</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Stake, Earn – And more!</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeFlexibleSideVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Flexible staking.</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO CAKE',
    description: <Trans>Stake CAKE to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

export const livePools: SerializedPoolConfig[] = [
  {
    sousId: 104,
    stakingToken: serializedTokens.bsx,
    earningToken: serializedTokens.wbnb,
    contractAddress: {
      [ChainId.BASE]: '0x26fd5DE668F091222791cc0eA45AC072d7bFE0cd',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0000015',
    isBoost: true,
  },
  //$207

  {
    sousId: 103,
    stakingToken: serializedTokens.bsx,
    earningToken: serializedTokens.usdbc,
    contractAddress: {
      [ChainId.BASE]: '0x55da9a8a85d37764934a8915621baa00fafdc3eb',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '.0027',
    isBoost: true,
  },

  // $233
  {
    sousId: 100,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.usdbc,
    contractAddress: {
      [ChainId.BASE]: '0x64FCFA940f286Af1261107F993189379e8d3ae1c',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0033',
    isBoost: false,
  },
  //$285
  {
    sousId: 101,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.wbnb,
    contractAddress: {
      [ChainId.BASE]: '0x86DBd5bAAE91AC576E8e5197EB2497603d0056EA',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0000021',
    isBoost: true,
  },
  {
    sousId: 105,
    stakingToken: serializedTokens.xbsx,
    earningToken: serializedTokens.usdbc,
    contractAddress: {
      [ChainId.BASE]: '0x326929EAE4e1923B9D08de6Bd8B2e16F7dd35Cd4',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0011',
    isBoost: true,
  },
  {
    sousId: 102,
    stakingToken: serializedTokens.bsx,
    earningToken: serializedTokens.ede,
    contractAddress: {
      [ChainId.BASE]: '0x8D52E213D741684dec1d37a6ee7814aE32942c1e',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.00',
  },
]

// known finished pools
const finishedPools = [
  // {
  //   sousId: 285,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.sdao,
  //   contractAddress: {
  //     56: '0x168eF2e470bfeAEB32BE52FB218A41483904851c',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '0.405',
  //   version: 3,
  // }
].map((p) => ({ ...p, isFinished: true }))

export default [...livePools, ...finishedPools]
