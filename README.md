# BaseSwap: Info

```
A brief overview how Info part of BaseSwap website works.
```

# Step by step to run this project

## clone

First you must clone the repository.
```
git clone https://github.com/Avantsoftchain/Aptec_x7.git
```

## Install the dependencies

This project depends on some dependencies, so the command npm install or yarn takes care of installing all of them
```
cd client
npm install
cd ..
npm install
```

## Run the project

Runs the app in the development mode
Open [http://127.0.0.1:80](http://127.0.0.1:80) to view it in the browser.
```
npm run start
```

# Code structure

```
In terms of React components Info section is just another view (located in [client/src/views/Info](../client/src/views/Info)) that is assigned route (in [App.tsx](../client/src/App.tsx)).  
There are also some Info-related components inside [client/src/components](../client/src/components) (InfoNav, InfoCharts, InfoTables and InfoSearch at the time of writing).

There are helper functions to handle data formatting and requests - [client/src/utils/infoDataHelpers.ts](../client/src/utils/infoDataHelpers.ts) and [client/src/utils/infoQueryHelpers.ts](../client/src/utils/infoQueryHelpers.ts)

Info section has it's own reducer in Redux store - [client/src/state/info](../client/src/state/info). It handles all data about pools, tokens and overall protocol. The only exception is token/pool watchlist that is stored under [client/src/state/user](../client/src/state/user) reducer.

GraphQL request logic lives under [client/src/state/info/queries](../client/src/state/info/queries) directory. Code over there handles firing requests to StreamingFast subgraph as well as formatting returned values and calculating all the derived data we need.
```

# Requests flow

```
When user visits Info page the following requests are fired (names as declared in [client/src/state/info/queries](../client/src/state/info/queries)):

    o Overview : gets basic protocol data like volume, liquidity and transaction count. 
        3 requests are fired for current, 24h ago and 48h ago data.  
    o OverviewCharts : gets data to show liquidity and volume charts on overview page.  
    o OverviewTransactions : gets data to show transaction table on overview page

    o Prices : gets BNB prices (current, 24h, 48 and 7d ago) used in calculations (see [client/src/hooks/
        useBnbPrices.ts](../client/src/hooks/useBnbPrices.ts))

    o TopTokens : gets top NN pools by 24h volume. This request just fetches token addresses, full data is 
        handled separately.
    o Tokens : given the list of token addresses retrieves all needed data about these tokens. Done in single 
        request but it is in fact 5 batched requests for different timeframes (needed to calculate rate of change). When user first opens the page this request is requesting data for token addresses acquired via topTokens request.

    o TopPools : same as topTokens but for pools
    o Pools : same as tokens but for pools

There are also multiple blocks queries to retrieve block numbers at different timestamps.

The flow is controlled by [client/src/state/info/updaters.ts](../client/src/state/info/updaters.ts). When user navigates through the site more pools and tokens are automatically loaded, (e.g. you click on BNB token and pools for BNB are loaded automatically, if you click on BNB-BTCB then BTCB token will be loaded, etc)

There are additional requests for price chart and search that are fired when user uses these features.
```

