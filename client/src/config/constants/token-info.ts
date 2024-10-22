import { ChainId } from '@magikswap/sdk'
import { currentTokenMap } from './tokens'

export const DEFAULT_STABLE_SYMBOL = 'USDbC'
export const WRAPPED_NATIVE_SYMBOL = 'WETH'

export interface ITokenInfo {
  coinGeckoId?: string
  dexscreenerPair?: string
  name?: string
  symbol?: string
  decimals?: number
  logoURI?: string
  tokenListKey?: string // key in tokens.ts if needed to join to get a token instance
  addresses: { [chainId: number]: string }
}

export type StableTokenLookupKey =
  | 'USDP'
  | 'DAIP'
  | 'DAI'
  | 'USDPLUS'
  | 'DAIPLUS'
  | 'MAI'
  | 'USDC'
  | 'axlUSDC'
  | 'USDbC'
  | 'USDC'
// Add to this list as needed
export type TokenLookupKey =
  | StableTokenLookupKey
  | 'ProtocolToken'
  | 'BSWAP'
  | 'xProtocolToken'
  | 'WETH'
  | 'DAI+'
  | 'USD+'
  | 'OGRE'
  | 'DAI'
  | 'USDbC'
  | 'CBETH'
  | 'MIM'
  | 'USDP'
  | 'DAIP'
  | 'axlWBTC'
  | 'BBT'
  | 'EDE'
  | 'YFX'
  | 'AXLWBTC'
  | 'MAG'
  | 'BLAZE'
  | 'UNIDX'
  | 'BASIN'
  | 'BSX'
  | 'GMD'
  | 'GND'
  | 'MAI'
  | 'BULLRUN'
  | 'DOLA'
  | 'ARX'



export type TokenInfoMapping = {
  [key in TokenLookupKey]?: ITokenInfo
}

export const STABLE_TOKEN_INF0: TokenInfoMapping = {

  axlUSDC: {
    coinGeckoId: 'axlusdc',
    decimals: 6,
    addresses: {
      [ChainId.BASE]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    },
  },
  USDbC: {
    coinGeckoId: 'usd-coin',
    decimals: 6,
    addresses: {
      [ChainId.BASE]: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    },
  },
  USDC: {
    coinGeckoId: 'usd-coin',
    decimals: 6,
    addresses: {
      [ChainId.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
  MAI: {
    coinGeckoId: 'mimatic',
    decimals: 18,
    addresses: {
      [ChainId.BASE]: '0xbf1aeA8670D2528E08334083616dD9C5F3B087aE',
    },
  },
  DAI: {
    coinGeckoId: 'dai',
    decimals: 18,
    addresses: {
      [ChainId.BASE]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    },
  },
  USDPLUS: {
    coinGeckoId: 'usd',
    addresses: {
      [ChainId.BASE]: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  },
  DAIPLUS: {
    coinGeckoId: 'overnight-dai',
    addresses: {
      [ChainId.BASE]: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
  },
}

export const TOKEN_INF0: TokenInfoMapping = {
  ...STABLE_TOKEN_INF0,
  ProtocolToken: {
    addresses: {
      [ChainId.BASE]: '0xd5046B976188EB40f6DE40fB527F89c05b323385', // BSX
    },
  },
  xProtocolToken: {
    addresses: {
      [ChainId.BASE]: '0xE4750593d1fC8E74b31549212899A72162f315Fa', // xBSX
    },
  },
  BSWAP: {
    dexscreenerPair: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    addresses: {
      [ChainId.BASE]: '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9',
    },
  },
  BSX: {
    dexscreenerPair: '0x7fea0384f38ef6ae79bb12295a9e10c464204f52',
    addresses: {
      [ChainId.BASE]: '0xd5046B976188EB40f6DE40fB527F89c05b323385',
    },
  },
  WETH: {
    coinGeckoId: 'ethereum',
    addresses: {
      [ChainId.BASE]: '0x4200000000000000000000000000000000000006',
    },
  },
  EDE: {
    addresses: {
      [ChainId.BASE]: '0x0A074378461FB7ed3300eA638c6Cc38246db4434',
    },
  },
  BULLRUN: {
    addresses: {
      [ChainId.BASE]: '0x1A9132ee02d7E98e51b7389D2e7BB537184867Aa',
    },
  },
  CBETH: {
    addresses: {
      [ChainId.BASE]: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    },
  },
  MIM: {
    addresses: {
      [ChainId.BASE]: '0x4A3A6Dd60A34bB2Aba60D73B4C88315E9CeB6A3D',
    },
  },
  YFX: {
    addresses: {
      [ChainId.BASE]: '0x8901cB2e82CC95c01e42206F8d1F417FE53e7Af0',
    },
  },
  GMD: {
    addresses: {
      [ChainId.BASE]: '0xCd239E01C36d3079c0dAeF355C61cFF591C40DB1',
    },
  },
  GND: {
    addresses: {
      [ChainId.BASE]: '0xfb825e93822dd971ebdfdb2180a751958dbd5e16',
    },
  },
  AXLWBTC: {
    dexscreenerPair: '0x317d373E590795e2c09D73FaD7498FC98c0A692B',
    addresses: {
      [ChainId.BASE]: '0x1a35EE4640b0A3B87705B0A4B45D227Ba60Ca2ad',
    },
  },
  MAG: {
    addresses: {
      [ChainId.BASE]: '0x2DC1cDa9186a4993bD36dE60D08787c0C382BEAD',
    },
  },
  BLAZE: {
    addresses: {
      [ChainId.BASE]: '0x37DEfBC399e5737D53Dfb5533d9954572F5B19bf',
    },
  },
  UNIDX: {
    dexscreenerPair: '0x30dcc8444f8361d5ce119fc25e16af0b583e88fd',
    addresses: {
      [ChainId.BASE]: '0x6B4712AE9797C199edd44F897cA09BC57628a1CF',
    },
  },
  BASIN: {
    addresses: {
      [ChainId.BASE]: '0x4788de271F50EA6f5D5D2a5072B8D3C61d650326',
    },
  },
  DOLA: {
    dexscreenerPair: '',
    addresses: {
      [ChainId.BASE]: '0x4621b7A9c75199271F773Ebd9A499dbd165c3191',
    },
  },
  ARX: {
    dexscreenerPair: '',
    addresses: {
      [ChainId.BASE]: '0x58Ed4FD0C3d930b674BA50a293f03ef6cD7dE7a3',
    },
  },
  MAI: {
    dexscreenerPair: '0x9e574f9aD6ca1833f60d5bB21655dd45278A6e3A',
    addresses: {
      [ChainId.BASE]: '0xbf1aeA8670D2528E08334083616dD9C5F3B087aE',
    },
  },
  OGRE: {
    addresses: {
      [ChainId.BASE]: '0xAB8a1c03b8E4e1D21c8Ddd6eDf9e07f26E843492',
    },
  },
}

export function getTokenAddressesForChain(chainId: ChainId) {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].addresses[chainId])
    .map((info) => info[1].addresses[chainId])

  return infos
}

export const getCoingeckoTokenInfos = (chainId: ChainId): { tokenAddress: string; geckoId: string }[] => {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].coinGeckoId && info[1].addresses[chainId])
    .map((info) => {
      return {
        geckoId: info[1].coinGeckoId,
        tokenAddress: info[1].addresses[chainId],
      }
    })

  return infos
}

export const getDexscreenerTokenInfos = (chainId: ChainId): { tokenAddress: string; dexscreenerPair: string }[] => {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].dexscreenerPair && info[1].addresses[chainId])
    .map((info) => {
      return {
        dexscreenerPair: info[1].dexscreenerPair,
        tokenAddress: info[1].addresses[chainId],
      }
    })

  return infos
}

export function getTokenInfo(key: TokenLookupKey, chainId: number): TokenInfoMapping & { address: string } {
  const token = TOKEN_INF0[key]

  return {
    ...token,
    address: token.addresses[chainId],
  }
}

export const getTokenAddress = (keyOrSymbol: TokenLookupKey, chainId: ChainId) => {
  if (!chainId) return ''

  const ref = TOKEN_INF0[keyOrSymbol]
  if (!ref) {
    throw new Error(`No address mapping for keyOrSymbol: ${keyOrSymbol}`)
  }

  const address = ref.addresses[chainId]
  if (!address) {
    throw new Error(`No chain id address mapping: ${chainId}`)
  }

  return address
}

export const getTokenImage = (address: string) => {
  return `/images/tokens/${address}.png`
}

export function getTokenInstance(address: string) {
  const instance = Object.entries(currentTokenMap).find((tk) => tk[1].address.toLowerCase() === address.toLowerCase())
  return instance ? instance[1] : null
}
