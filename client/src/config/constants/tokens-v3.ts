import { ChainId, Ether, NativeCurrency, Token } from '@baseswapfi/sdk-core'

export const NATIVE_CHAIN_ID = 'NATIVE'

export const WRAPPED_NATIVE = {
  [ChainId.BASE_GOERLI]: new Token(
    ChainId.BASE_GOERLI,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [ChainId.BASE]: new Token(ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
}

export const PROTOCOL_TOKEN_V3 = {
  [ChainId.BASE]: new Token(ChainId.BASE, '0xd5046B976188EB40f6DE40fB527F89c05b323385', 18, 'BSX', 'Baseswap'),
}

export const XPROTOCOL_TOKEN_V3 = {
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    '0xE4750593d1fC8E74b31549212899A72162f315Fa',
    18,
    'xBSX',
    'Baseswap Escrowed Token',
  ),
}

export const USDBC_BASE = new Token(
  ChainId.BASE,
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  6,
  'USDbC',
  'USD Base Coin',
)

export const STABLE_COIN: { [chainId: number]: Token } = {
  [ChainId.BASE]: USDBC_BASE,
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token } = {
  [ChainId.BASE]: WRAPPED_NATIVE[ChainId.BASE],
}

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    if (this._cachedExtendedEther[chainId]) return this._cachedExtendedEther[chainId]
    this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)
    return this._cachedExtendedEther[chainId]
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]

  const nativeCurrency = ExtendedEther.onChain(chainId)
  cachedNativeCurrency[chainId] = nativeCurrency

  return nativeCurrency
}
