import { Token, TokenAmount } from '@magikswap/sdk'
import { useMemo } from 'react'
import { useAllTokenBalances } from '../../state/wallet/hooks'

const PINNED_TOKENS = ['BSWAP', 'BSX', 'USDC', 'WETH']; 

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  }
  if (balanceA && balanceA.greaterThan('0')) {
    return -1
  }
  if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // Prioritize pinned tokens
    const isTokenAPinned = PINNED_TOKENS.includes(tokenA.symbol || '');
    const isTokenBPinned = PINNED_TOKENS.includes(tokenB.symbol || '');
    if (isTokenAPinned && !isTokenBPinned) return -1;
    if (!isTokenAPinned && isTokenBPinned) return 1;

    // If neither or both tokens are pinned, continue to the next sorting criteria

    // sort by balances
    const balanceA = balances[tokenA.address]
    const balanceB = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp;

    // sort by symbol alphabetically
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    
    return tokenA.symbol ? -1 : tokenB.symbol ? 1 : 0;
  }
}

function useTokenComparator(inverted: boolean): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances()
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export default useTokenComparator
