import { selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import { getPairPricesQuery, getTokenBalancesQuery } from "./terraswap"

const contracts: Dictionary<string> = {
  anchorMarket: "terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal",
}

export const assets: Dictionary<ListedItemExternal> = {
  terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl: {
    symbol: "aUST",
    token: "terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl",
    icon: "https://whitelist.anchorprotocol.com/logo/aUST.png",
  },
  terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc: {
    symbol: "ANC",
    token: "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc",
    pair: "terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz",
    icon: "https://whitelist.anchorprotocol.com/logo/ANC.png",
  },
}

interface EpochState {
  aterra_supply: string
  exchange_rate: string
}

const getToken = (symbol: string) =>
  Object.values(assets).find((item) => item.symbol === symbol)?.token ?? ""

export const anchorMarketEpochStateQuery = selector({
  key: "anchorMarketEpochState",
  get: async ({ get }) => {
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<EpochState>(
      { contract: contracts["anchorMarket"], msg: { epoch_state: {} } },
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
