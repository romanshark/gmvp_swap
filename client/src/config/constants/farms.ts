import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { ChainId } from '../../../packages/swap-sdk/src/constants'
import { TOKENS_CHAIN_MAP } from './tokens'
import { SerializedFarmConfig } from './types'

export const serializedTokens = serializeTokens(TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID])

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

const farms: SerializedFarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'BBT-ETH LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '0xf4b96d5162adee867b6361e9f1848d701c4286c7',
  //   },
  //   nftPoolAddress: {
  //     [ChainId.BASE]: '0x6cC611e036D9cE3f66502d5cC544cdC209542Fc2',
  //   },
  //   token: serializedTokens.bbt,
  //   quoteToken: serializedTokens.wbnb,
  //   classic: true,
  // },
  {
    pid: 1,
    lpSymbol: 'BSWAP-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xaA93C2eFD8fcC07c723E19A6e78eF5d2644BF391',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isCore: true, 
    //points: 1000 BSX and 1025 BSWAP 
  },
  {
    pid: 16,
    lpSymbol: 'BSX-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x7fea0384f38ef6ae79bb12295a9e10c464204f52',
      [ChainId.BASE]: '0x7fea0384f38ef6ae79bb12295a9e10c464204f52',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x7C04bF2bb7D27982810E432B188FA0C7729e651d',
    },
    token: serializedTokens.bsx,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isCore: true, 
    //points: 975 BSX and 845 BSWAP (WETH)
  },

  {
    pid: 21,
    lpSymbol: 'USDbC-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0xC52328d5Af54A12DA68459Ffc6D0845e91a8395F',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xD239824786D69627bc048Ee258943F2096Cf2Ab7',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.usdbc,
    classic: true, 
    isStable: true, 
    // points: 150 
  },
  {
    pid: 22,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0xab067c01C7F5734da168C699Ae9d23a4512c9FdB',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x179A0348DeCf6CBF2cF7b0527E3D6260e2068552',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
    classic: true, 
    isBluechip: true, 

    // points: 150 
  },
  {
    pid: 23,
    lpSymbol: 'ARX-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x7Ed8FD9D4bb2562b4F53D1A62C2CD30b698cB2e8',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xDe88e008902d8e7f4Bf808346D160d9295c88516',
    },
    token: serializedTokens.arx,
    quoteToken: serializedTokens.wbnb,
    classic: true, 
    isPartner: true, 

    // points: 75 --> 65
  },
  {
    pid: 20,
    lpSymbol: 'MAI-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x9e574f9aD6ca1833f60d5bB21655dd45278A6e3A',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x9D6dE2cb0BB319129170730D75E6FffCa811aD74',
    },
    token: serializedTokens.mai,
    quoteToken: serializedTokens.usdbc,
    classic: true, 
    isStable: true, 
    // points: 100 --> 75 
  },
  {
    pid: 19,
    lpSymbol: 'ETH-DAI LP',
    lpAddresses: {
      [ChainId.BASE]: '0x0FeB1490f80B6978002c3E501753562f2F2853B2',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x612E2527b37CC5c46df1cfd172456E4DD507Cf09',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.dai,
    classic: true, 
    isBluechip: true, 
    // points: 150 --> 125 
  },
 
  {
    pid: 7,
    lpSymbol: 'ETH-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x41d160033C222E6f3722EC97379867324567d883',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x34688C3E5AAD119851D5dc6AEb01Bf6DEA746eE7',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isBluechip: true, 

    // points: 350, 
  },

  {
    pid: 14,
    lpSymbol: 'axlWBTC-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x317d373E590795e2c09D73FaD7498FC98c0A692B',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x7E0F687d82D05aDb99D196Cd8E342f042803A4b6',
    },
    token: serializedTokens.axlwbtc,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isBluechip: true, 

    // points: 40 --> 35 
  },


  {
    pid: 3,
    lpSymbol: 'axlUSDC-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x9a0b05f3cf748a114a4f8351802b3bffe07100d4',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x7d3cab8613e18534A2C11277b8EF2AaCaD94f842',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.axlUsdc,
    classic: true,
    isBluechip: true, 
    //points: 300 --> 150 
  },

  {
    pid: 8,
    lpSymbol: 'MIM-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0xa2b120cab75aefdfafda6a14713349a3096eed79',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x36A3483353B89CDBa4D7e4D1a81E3CEe15947eD1',
    },
    token: serializedTokens.mim,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isStable: true, 
    // points: 110 -- >90 
  },
  {
    pid: 10,
    lpSymbol: 'USD+-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xB404b32D20F780c7c2Fa44502096675867DecA1e',
    },
    token: serializedTokens.usdp,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isStable: true, 
    //points: 110 
  },
  {
    pid: 11,
    lpSymbol: 'DAI+-USD+ LP',
    lpAddresses: {
      [ChainId.BASE]: '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x502D1aaC6D8265C1fF3dDef4f03FBe0edE41Fb69',
    },
    token: serializedTokens.daip,
    quoteToken: serializedTokens.usdp,
    classic: true,
    isStable: true, 
    // points: 85 
  },
  {
    pid: 5,
    lpSymbol: 'DAI-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x6D3c5a4a7aC4B1428368310E4EC3bB1350d01455',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xEC652B590Fe21dcd18Ea01253B5152b202cc3dEb',
    },
    token: serializedTokens.dai,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isStable: true, 
    // points: 300 
  },
  {
    pid: 6,
    lpSymbol: 'CBETH-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x07CFA5Df24fB17486AF0CBf6C910F24253a674D3',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x858a8B8143F8A510f663F8EeF31D9bF1Fb4d986F',
    },
    token: serializedTokens.cbeth,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isBluechip: true, 

    // points: 305 
  },

  {
    pid: 17,
    lpSymbol: 'GND-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x4174E40E3012d5B8aA28D7db7303eAC9e01b13Fd',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x2F097F6363B46bb64B9eE94472D8eFD5D70C617f',
    },
    token: serializedTokens.gnd,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 70 --> 40 
  },
  {
    pid: 18,
    lpSymbol: 'GMD-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x93DcFBE3174e5EFE65687ba5331626f44DC5e4dD',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x47C9EBbA01af879dAC60b2A88dff8216aDA60312',
    },
    token: serializedTokens.gmd,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 70 --> 50 
  },
  {
    pid: 12,
    lpSymbol: 'BASIN-WETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x6EDa0a4e05fF50594E53dBf179793CADD03689e5',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xfd6e1E7289a2F1a8Aa375d7b773D4C1f48E268a2',
    },
    token: serializedTokens.basin,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 70 --> 50 
  },
  {
    pid: 15,
    lpSymbol: 'UNIDX-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x30dcc8444F8361D5CE119fC25e16AF0B583e88Fd',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x76B9D14133a3AC1318c1a52F68b2caCe5cC4b053',
    },
    token: serializedTokens.unidx,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 85 --> 50 
  },
  {
    pid: 13,
    lpSymbol: 'YFX-USDbC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x1cd6ca847016a3bd0cc1fe2df5027e78ea428170',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xFc755e39A85E6D7AdB313E15048EfDfFfd53c164',
    },
    token: serializedTokens.yfx,
    quoteToken: serializedTokens.usdbc,
    classic: true,
    isPartner: true, 
    // points: 50

  },
  {
    pid: 24,
    lpSymbol: 'BULLRUN-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0xeD89cC1fc96F749CceD4b94eA366A0d4c7C1826f',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xda010d0EC9D32083eF627781d55b58Ac510a1e37',
    },
    token: serializedTokens.bullrun,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 10
  },
  {
    pid: 9,
    lpSymbol: 'EDE-WETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x2135780D04C96E14bC205d2c8B8eD4e716d09A2b',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xDa95F1012702DFE1E6C9827638d0aB21637717E7',
    },
    token: serializedTokens.ede,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true,
    // points: 5 --> 0 
  },

  {
    pid: 2,
    lpSymbol: 'OGRE-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0x81a03d61c913bdcc60519423c8841c18ffb752a8',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x4C8A2e0aB00A9A3685F68700D7B67bA4C6dA7111',
    },
    token: serializedTokens.ogre,
    quoteToken: serializedTokens.wbnb,
    classic: true,
    isPartner: true, 
    // points: 0

  },

 

 
 
]

export default farms

export const getNftPoolConfigs = (chainId: number) => {
  return farms.filter((f) => f.nftPoolAddress && f.nftPoolAddress[chainId])
}

export const getNftPoolAddresses = (chainId: number) => {
  return getNftPoolConfigs(chainId).map((f) => f.nftPoolAddress[chainId])
}
