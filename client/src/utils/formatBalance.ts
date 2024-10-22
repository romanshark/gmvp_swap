import BigNumber from 'bignumber.js'
import { BigNumber as EthersBigNumber, FixedNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { getLanguageCodeFromLS } from '@pancakeswap/localization'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(getFullDecimalMultiplier(decimals))
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number): string => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export function formatNumberScale(number: any, usd = false) {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)
  const wholeNumberLength = String(Math.floor(num)).length

  if (wholeNumberLength >= 13) return (usd ? '$' : '') + (num / Math.pow(10, 12)).toFixed(1) + 'T'
  if (wholeNumberLength >= 10) return (usd ? '$' : '') + (num / Math.pow(10, 9)).toFixed(1) + 'B'
  if (wholeNumberLength >= 7) return (usd ? '$' : '') + (num / Math.pow(10, 6)).toFixed(1) + 'M'
  if (wholeNumberLength >= 4) return (usd ? '$' : '') + (num / Math.pow(10, 3)).toFixed(1) + 'K'

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  return (usd ? '$' : '') + num.toFixed(2)
}

/**
 * Don't use the result to convert back to number.
 * It uses undefined locale which uses host language as a result.
 * Languages have different decimal separators which results in inconsistency when converting back this result to number.
 */
export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}

/**
 * Method to format the display of wei given an EthersBigNumber object
 * Note: does NOT round
 */
export const formatBigNumber = (number: EthersBigNumber, displayDecimals = 18, decimals = 18) => {
  const remainder = number.mod(EthersBigNumber.from(10).pow(decimals - displayDecimals))
  return formatUnits(number.sub(remainder), decimals)
}

/**
 * Method to format the display of wei given an EthersBigNumber object with toFixed
 * Note: rounds
 */
export const formatBigNumberToFixed = (number: EthersBigNumber, displayDecimals = 18, decimals = 18) => {
  const formattedString = formatUnits(number, decimals)
  return (+formattedString).toFixed(displayDecimals)
}

/**
 * Formats a FixedNumber like BigNumber
 * i.e. Formats 9763410526137450427.1196 into 9.763 (3 display decimals)
 */
export const formatFixedNumber = (number: FixedNumber, displayDecimals = 18, decimals = 18) => {
  // Remove decimal
  const [leftSide] = number.toString().split('.')
  return formatBigNumber(EthersBigNumber.from(leftSide), displayDecimals, decimals)
}

export const formatLocalisedCompactNumber = (number: number): string => {
  const codeFromStorage = getLanguageCodeFromLS()

  const isClient = typeof window === 'object'
  const isSupported = window?.Intl

  // For clients do not support Intl, just return number
  if (isClient && !isSupported) {
    return `${number}`
  }

  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumSignificantDigits: 2,
  }).format(number)
}

export default formatLocalisedCompactNumber

export const formatLpBalance = (balance: BigNumber) => {
  const stakedBalanceBigNumber = getBalanceAmount(balance)
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
    return '< 0.00001'
  }
  return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
}
