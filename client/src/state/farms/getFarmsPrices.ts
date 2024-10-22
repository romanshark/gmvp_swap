import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { SerializedFarm } from 'state/types'
import { DEFAULT_STABLE_SYMBOL, WRAPPED_NATIVE_SYMBOL } from 'config/constants/token-info'
import { farmsConfig } from 'config/constants'
import fetchFarms from './fetchFarms'

// const getFarmFromTokenSymbol = (
//   farms: SerializedFarm[],
//   tokenSymbol: string,
//   preferredQuoteTokens?: string[],
// ): SerializedFarm => {
//   const farmsWithTokenSymbol = farms.filter((farm) => {
//     return farm.token.symbol === tokenSymbol
//   })

//   const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)

//   return filteredFarm
// }

const getFarmBaseTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const getFarmsPrices = async (farmList: SerializedFarm[]) => {
  let nativeStableFarm = farmList.find(
    (farm) => farm.token.symbol === WRAPPED_NATIVE_SYMBOL && farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL,
  )

  if (!nativeStableFarm) {
    nativeStableFarm = (
      await fetchFarms(
        farmsConfig.filter(
          (farm) => farm.token.symbol === WRAPPED_NATIVE_SYMBOL && farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL,
        ),
      )
    )[0]
  }

  const nativePriceInStable = nativeStableFarm.tokenPriceVsQuote
    ? new BigNumber(nativeStableFarm.tokenPriceVsQuote)
    : BIG_ZERO

  const farmsWithPrices = farmList.map((farm) => {
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, nativeStableFarm, nativePriceInStable)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, nativeStableFarm, nativePriceInStable)

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices
