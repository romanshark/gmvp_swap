import { DEFAULT_STABLE_SYMBOL, WRAPPED_NATIVE_SYMBOL } from 'config/constants/token-info'
import { SerializedFarm } from 'state/types'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (
  farms: SerializedFarm[],
  preferredQuoteTokens: string[] = [DEFAULT_STABLE_SYMBOL, WRAPPED_NATIVE_SYMBOL],
): SerializedFarm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })

  return preferredFarm || farms[1]
}

export default filterFarmsByQuoteToken
