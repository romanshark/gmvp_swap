import { baseTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const priceHelperLps: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'BSWAP-ETH LP',
    lpAddresses: {
      8453: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    },
    token: baseTokens.cake,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'OGRE-ETH LP',
    lpAddresses: {
     8453: '0x81a03d61c913bdcc60519423c8841c18ffb752a8',
    },
    token: baseTokens.ogre,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'axlUSDC-ETH LP',
    lpAddresses: {
     8453: '0x9a0b05f3cf748a114a4f8351802b3bffe07100d4',
    },
    token: baseTokens.axlUsdc,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'USDBC-ETH LP',
    lpAddresses: {
     8453: '0x29a706a49baE714bCfcC96ac1A43e116cB57794c',
    },
    token: baseTokens.usdbc,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'DAI-USDBC LP',
    lpAddresses: {
     8453: '0x6D3c5a4a7aC4B1428368310E4EC3bB1350d01455',
    },
    token: baseTokens.dai,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 6,
    lpSymbol: 'CBETH-ETH LP',
    lpAddresses: {
     8453: '0x07CFA5Df24fB17486AF0CBf6C910F24253a674D3',
    },
    token: baseTokens.cbeth,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 8,
    lpSymbol: 'MIM-USDbC LP',
    lpAddresses: {
      8453: '0xa2b120cab75aefdfafda6a14713349a3096eed79',
    },
    token: baseTokens.mim,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 9,
    lpSymbol: 'EDE-WETH LP',
    lpAddresses: {
     8453: '0x2135780D04C96E14bC205d2c8B8eD4e716d09A2b',
    },
    token: baseTokens.ede,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'USD+-USDbC LP',
    lpAddresses: {
      8453: '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A',
    },
    token: baseTokens.usdp,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 11,
    lpSymbol: 'DAI+-USD+ LP',
    lpAddresses: {
      8453: '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306',
    },
    token: baseTokens.daip,
    quoteToken: baseTokens.usdp,
  },
  {
    pid: 12,
    lpSymbol: 'BASIN-WETH LP',
    lpAddresses: {
      8453: '0x6EDa0a4e05fF50594E53dBf179793CADD03689e5',
    },
    token: baseTokens.basin,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 13,
    lpSymbol: 'YFX-USDbC LP',
    lpAddresses: {
      8453: '0x1cd6ca847016a3bd0cc1fe2df5027e78ea428170',
    },
    token: baseTokens.yfx,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 14,
    lpSymbol: 'axlWBTC-USDbC LP',
    lpAddresses: {
      8453: '0x317d373E590795e2c09D73FaD7498FC98c0A692B',
    },
    token: baseTokens.axlwbtc,
    quoteToken: baseTokens.usdbc,
  },
  
  {
    pid: 15,
    lpSymbol: 'UNIDX-ETH LP',
    lpAddresses: {
      8453: '0x30dcc8444F8361D5CE119fC25e16AF0B583e88Fd',
    },
    token: baseTokens.unidx,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 16,
    lpSymbol: 'BSX-ETH LP',
    lpAddresses: {
      8453: '0x7fea0384f38ef6ae79bb12295a9e10c464204f52'
    },
    token: baseTokens.bsx,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 17,
    lpSymbol: 'GND-ETH LP',
    lpAddresses: {
      8453: '0x4174E40E3012d5B8aA28D7db7303eAC9e01b13Fd'
    },
   
    token: baseTokens.gnd,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 18,
    lpSymbol: 'GMD-ETH LP',
    lpAddresses: {
     8453: '0x93DcFBE3174e5EFE65687ba5331626f44DC5e4dD'
     },
    token: baseTokens.gmd,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 19,
    lpSymbol: 'ETH-DAI LP',
    lpAddresses: {
      8453: '0x0FeB1490f80B6978002c3E501753562f2F2853B2',
    },
    token: baseTokens.dai,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 20,
    lpSymbol: 'MAI-USDbC LP',
    lpAddresses: {
      8453: '0x9e574f9aD6ca1833f60d5bB21655dd45278A6e3A',
    },
    token: baseTokens.mai,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 21,
    lpSymbol: 'USDbC-USDC LP',
    lpAddresses: {
      8453: '0xC52328d5Af54A12DA68459Ffc6D0845e91a8395F',
    },
    token: baseTokens.usdc,
    quoteToken: baseTokens.usdbc,
    // points: 100 
  },
  {
    pid: 22,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
     8453: '0xab067c01C7F5734da168C699Ae9d23a4512c9FdB',
    },
    token: baseTokens.usdc,
    quoteToken: baseTokens.wbnb,
    // points: 100 
  },
]

export default priceHelperLps
