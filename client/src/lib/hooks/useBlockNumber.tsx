import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const MISSING_PROVIDER = Symbol()
const BlockNumberContext = createContext<
  | {
      fastForward(block: number): void
      block?: number
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

function useBlockNumberContext() {
  const blockNumber = useContext(BlockNumberContext)
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error('BlockNumber hooks must be wrapped in a <BlockNumberProvider>')
  }
  return blockNumber
}

export function useFastForwardBlockNumber(): (block: number) => void {
  return useBlockNumberContext().fastForward
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  return useBlockNumberContext().block
}

export function BlockNumberProvider({ children }: { children: ReactNode }) {
  const { chainId: activeChainId, library } = useActiveWeb3React()
  const [{ chainId, block }, setChainBlock] = useState<{
    chainId?: number
    block?: number
  }>({
    chainId: activeChainId,
  })

  const onChainBlock = useCallback((chainId: number, block: number) => {
    setChainBlock((chainBlock) => {
      if (chainBlock.chainId === chainId) {
        if (!chainBlock.block || chainBlock.block < block) {
          return { chainId, block }
        }
      }

      return chainBlock
    })
  }, [])

  const windowVisible = useIsWindowVisible()
  useEffect(() => {
    let stale = false

    if (library && activeChainId && windowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) => {
        return chainBlock.chainId === activeChainId ? chainBlock : { chainId: activeChainId }
      })

      library
        .getBlockNumber()
        .then((block) => {
          if (!stale) onChainBlock(activeChainId, block)
        })
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${activeChainId}`, error)
        })

      const onBlock = (block: number) => onChainBlock(activeChainId, block)
      library.on('block', onBlock)
      return () => {
        stale = true
        library.removeListener('block', onBlock)
      }
    }

    return void 0
  }, [activeChainId, library, windowVisible, onChainBlock])

  const value = useMemo(
    () => ({
      fastForward: (update: number) => {
        if (block && update > block) {
          setChainBlock({
            chainId: activeChainId,
            block: update,
          })
        }
      },
      block: chainId === activeChainId ? block : undefined,
    }),
    [activeChainId, block, chainId],
  )
  return <BlockNumberContext.Provider value={value}>{children}</BlockNumberContext.Provider>
}
