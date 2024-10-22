import { ChainId, JSBI, Percent, Token } from '@magikswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { bscTokens, baseGoerliTokens, TOKENS_CHAIN_MAP, baseTokens } from './tokens'
import { ChainTokenList } from './types'

export const ROUTER_ADDRESS = {
  [ChainId.MAINNET]: '0x16327e3fbdaca3bcf7e38f5af2599d2ddc33ae52',
  [ChainId.BASE_GOERLI]: '0x865654Ebe6030686bDe44708597bbb3F289ea7f1',
  [ChainId.BASE]: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',
}

export const ROUTER_ADDRESS_ODOS = {
  //odos router address
  [ChainId.BASE]: '0x19cEeAd7105607Cd444F5ad10dd51356436095a1',
}

export const LOCKER_ADDRESS = {
  [ChainId.BASE]: '0x4e4c89937f85bD101C7FCB273435Ed89b49ad0B0', // 29 NOV
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.BASE_GOERLI]: [baseGoerliTokens.wbnb, baseGoerliTokens.cake],
  [ChainId.BASE]: [
    baseTokens.wbnb, 
    baseTokens.cake, 
    baseTokens.axlUsdc,
    baseTokens.usdbc, 
    baseTokens.dai, 
    baseTokens.usdp, 
    baseTokens.daip, 
    baseTokens.usdc, 
    baseTokens.mai
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [bscTokens.busd, bscTokens.cake, bscTokens.btcb],
  [ChainId.BASE_GOERLI]: [baseGoerliTokens.wbnb, baseGoerliTokens.cake],
  [ChainId.BASE]: [baseTokens.cake, baseTokens.bsx, baseTokens.usdbc],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt],
  [ChainId.BASE_GOERLI]: [baseGoerliTokens.wbnb, baseGoerliTokens.cake],
  [ChainId.BASE]: [baseTokens.wbnb, baseTokens.cake, baseTokens.axlUsdc, baseTokens.usdbc, baseTokens.dai],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
  //jumpman 
  [ChainId.BASE_GOERLI]: [[baseGoerliTokens.wbnb, baseGoerliTokens.cake]],
  [ChainId.BASE]: [[baseTokens.wbnb, baseTokens.cake]],
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'ETH'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID].cake

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const LIMIT_ORDERS_DOCS_URL = 'https://base-swap-1.gitbook.io/baseswap/'
