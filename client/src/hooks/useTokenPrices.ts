import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { getCombinedTokenPrices } from 'utils/tokenPricing'

const useTokenPrices = () => {
  const [prices, setPrices] = useState<{ [tokenAddress: string]: number }>({})
  const { chainId } = useWeb3React()

  useEffect(() => {
    const getPrices = async () => {
      const { prices: allPrices } = await getCombinedTokenPrices(chainId)
      setPrices(allPrices)
    }

    getPrices()
    const interval = setInterval(() => {
      getPrices()
    }, 30000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [chainId])

  const getTokenPrice = useCallback(
    (token: string) => {
      return prices[token?.toLowerCase()] || 0
    },
    [prices],
  )

  const getValueForAmount = useCallback(
    (token: string, amount: number, decimals = 3) => {
      const valueUSD = getTokenPrice(token) * amount

      return {
        valueUSD,
        valueLabel: `$${valueUSD.toFixed(decimals)}`,
      }
    },
    [getTokenPrice],
  )

  return {
    prices,
    getTokenPrice,
    getValueForAmount,
  }
}

export default useTokenPrices
