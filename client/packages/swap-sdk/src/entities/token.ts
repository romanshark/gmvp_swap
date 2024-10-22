import invariant from 'tiny-invariant'
import { ChainId } from '../constants'
import { validateAndParseAddress } from '../utils'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly isNative: false = false
  public readonly isToken: true = true
  public readonly chainId: ChainId
  public readonly address: string
  public readonly projectLink?: string

  public constructor(
    chainId: ChainId,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    projectLink?: string
  ) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
    this.projectLink = projectLink
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

// export const WETH9 = {
//   [ChainId.ETHEREUM]: new Token(
//     ChainId.ETHEREUM,
//     '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//     18,
//     'WETH',
//     'Wrapped Ether',
//     'https://weth.io'
//   ),
//   [ChainId.RINKEBY]: new Token(
//     ChainId.RINKEBY,
//     '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//     18,
//     'WETH',
//     'Wrapped Ether',
//     'https://weth.io'
//   )
// }

export const WBNB = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    18,
    'WFTM',
    'Wrapped Fantom',
    'https://www.binance.org'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BASE_GOERLI]: new Token(
    ChainId.BASE_GOERLI,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    ''
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    ''
  ),
}

export const WNATIVE = {
  // [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  // [ChainId.RINKEBY]: WETH9[ChainId.RINKEBY],
  [ChainId.MAINNET]: WBNB[ChainId.MAINNET],
  [ChainId.BSC_TESTNET]: WBNB[ChainId.BSC_TESTNET],
  [ChainId.BASE_GOERLI]: WBNB[ChainId.BASE_GOERLI],
  [ChainId.BASE]: WBNB[ChainId.BASE],
}
