import { DeserializedFarm } from 'state/types'

export const getSortedFarmsLP = (farmsLP: DeserializedFarm[]) => {
  if (!farmsLP) return []
  return [
    farmsLP.find((farm) => farm.pid === 1), // ARX-USDCe
    farmsLP.find((farm) => farm.pid === 0), // ARX-ETH
  ].filter((farm) => farm !== undefined)
}

export function getTVLFormatted(tvl: number) {
  const totalValueFormatted = `~$${(tvl || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  return totalValueFormatted
}
