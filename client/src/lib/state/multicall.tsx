import { createMulticall, ListenerOptions } from '@baseswapfi/redux-multicall'
import { ChainId } from '@baseswapfi/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useInterfaceMulticall } from 'hooks/useContract'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useMemo } from 'react'

const multicall = createMulticall()

export default multicall

/**
 *
 * @param chainId
 * @returns The approximate whole number of blocks written to the corresponding chainId per Ethereum mainnet epoch.
 */
function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  // TODO(WEB-2437): See if these numbers need to be updated
  switch (chainId) {
    case ChainId.BASE:
    case ChainId.BASE_GOERLI:
      return 15
    default:
      return 15
  }
}

export function MulticallUpdaterV3() {
  const { chainId } = useWeb3React()
  const latestBlockNumber = useBlockNumber()
  const contract = useInterfaceMulticall()
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId],
  )

  return (
    <>
      <multicall.Updater
        chainId={chainId}
        latestBlockNumber={latestBlockNumber}
        contract={contract}
        listenerOptions={listenerOptions}
      />
    </>
  )
}
