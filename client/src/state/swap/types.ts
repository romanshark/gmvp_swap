export type PairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  reserve0: number
  reserve1: number
}[]

export type DerivedPairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  token0DerivedBNB: number
  token1DerivedBNB: number
}[]

export type PairPricesNormalized = {
  time: Date
  value: number
}[]

export enum PairDataTimeWindowEnum {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export type SwapQuoteData = {
  blockNumber: number
  dataGasEstimate: number
  gasEstimate: number
  gasEstimateValue: number
  gweiPerGas: number
  inAmounts: string[]
  inTokens: string[]
  inValues: number[]
  netOutValue: number
  outAmounts: string[]
  outTokens: string[]
  outValues: number[]
  pathId: string
  pathViz: null
  pathVizImage: string
  percentDiff: number
  priceImpact: number
}