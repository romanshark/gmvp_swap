import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from '@apollo/client'
import { ChainId } from '@baseswapfi/sdk-core'

import { DEFAULT_CHAIN_ID } from 'utils/providers'

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.BASE]: 'https://api.thegraph.com/subgraphs/name/baseswapfi/v3-base',
}

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[DEFAULT_CHAIN_ID] })

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = DEFAULT_CHAIN_ID

  operation.setContext(() => ({
    uri: chainId && CHAIN_SUBGRAPH_URL[chainId] ? CHAIN_SUBGRAPH_URL[chainId] : CHAIN_SUBGRAPH_URL[DEFAULT_CHAIN_ID],
  }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
})
