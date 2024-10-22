import { Price, Token } from '@baseswapfi/sdk-core'
import { tickToPrice } from '@baseswapfi/v3-sdk2'

export function getTickToPrice(baseToken?: Token, quoteToken?: Token, tick?: number): Price<Token, Token> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick)
}
