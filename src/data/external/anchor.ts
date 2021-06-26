import { gql, request } from "graphql-request"
import { selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import { mantleURLQuery } from "../network"
import { getPairPricesQuery, getTokenBalancesQuery } from "./terraswap"

const contracts: Dictionary<string> = {
  anchorMarket: "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s",
}

export const assets: Dictionary<ListedItemExternal> = {
  terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu: {
    symbol: "aUST",
    token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
    icon: "https://whitelist.anchorprotocol.com/logo/aUST.png",
  },
  terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76: {
    symbol: "ANC",
    token: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76",
    pair: "terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3",
    icon: "https://whitelist.anchorprotocol.com/logo/ANC.png",
  },
}

interface EpochState {
  aterra_supply: string
  exchange_rate: string
}

const getToken = (symbol: string) =>
  Object.values(assets).find((item) => item.symbol === symbol)?.token ?? ""

const LAST_SYNCED_HEIGHT = gql`
  query {
    LastSyncedHeight
  }
`

const lastSyncedHeightQuery = selector({
  key: "lastSyncedHeight",
  get: async ({ get }) => {
    const url = get(mantleURLQuery)
    const { LastSyncedHeight } = await request<{ LastSyncedHeight: number }>(
      url + "?height",
      LAST_SYNCED_HEIGHT
    )

    return LastSyncedHeight
  },
})

export const anchorMarketEpochStateQuery = selector({
  key: "anchorMarketEpochState",
  get: async ({ get }) => {
    const getContractQuery = get(getContractQueryQuery)
    const height = get(lastSyncedHeightQuery)

    return await getContractQuery<EpochState>(
      {
        contract: contracts["anchorMarket"],
        msg: { epoch_state: { block_height: height + 1 } },
      },
      "anchorMarketEpochState"
    )
  },
})

export const anchorPricesQuery = selector<Dictionary>({
  key: "anchorPrices",
  get: async ({ get }) => {
    const getPairPrices = get(getPairPricesQuery("anchorPairPrices"))
    const pairPrices = await getPairPrices(assets)
    const epochState = get(anchorMarketEpochStateQuery)

    return {
      ...pairPrices,
      [getToken("aUST")]: epochState?.exchange_rate ?? "0",
    }
  },
})

export const anchorBalancesQuery = selector({
  key: "anchorBalances",
  get: async ({ get }) => {
    const getTokenBalances = get(getTokenBalancesQuery("anchorTokenBalances"))
    return await getTokenBalances(assets)
  },
})

export const anchorAssetListQuery = selector({
  key: "anchorAssets",
  get: ({ get }) => {
    const anchorPrices = get(anchorPricesQuery)
    const anchorBalances = get(anchorBalancesQuery)

    return Object.keys(assets).map((token) => ({
      ...assets[token],
      price: anchorPrices[token],
      balance: anchorBalances[token],
    }))
  },
})
