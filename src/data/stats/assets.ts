import { selector, selectorFamily } from "recoil"
import { useRecoilValue, useRecoilValueLoadable } from "recoil"
import { request } from "graphql-request"
import { path } from "ramda"
import { getTime, startOfMinute, subDays } from "date-fns"
import { minus, div, gt, isFinite, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { StatsNetwork } from "./statistic"
import { ASSETS } from "./gqldocs"

export const assetsQuery = selectorFamily({
  key: "assets",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)

      const { assets } = await request<{ assets: AssetDataItem[] }>(
        url + "?assetsStats",
        ASSETS.STATS,
        { network: network.toUpperCase() }
      )

      return assets.reduce<Dictionary<AssetDataItem>>(
        (acc, asset) => ({ ...acc, [asset.token]: asset }),
        {}
      )
    },
})

export const assetsHistoryQuery = selector({
  key: "assetsHistory",
  get: async ({ get }) => {
    get(locationKeyState)
    const url = get(statsURLQuery)
    const now = startOfMinute(new Date())

    const { assets } = await request<{ assets: AssetHistoryItem[] }>(
      url + "?assetsHistory",
      ASSETS.HISTORY,
      { interval: 60 / 4, from: subDays(now, 1).getTime(), to: now.getTime() }
    )

    return assets.reduce<Dictionary<PriceHistoryItem[]>>(
      (acc, { token, prices: { history } }) => ({ ...acc, [token]: history }),
      {}
    )
  },
})

export const getChangesQuery = selector({
  key: "getChange",
  get: async ({ get }) => {
    interface Asset {
      token: string
      prices: {
        price: string
        priceAt: string | null
        oraclePrice: string
        oraclePriceAt: string | null
      }
    }

    get(locationKeyState)
    const url = get(statsURLQuery)
    const yesterday = getTime(subDays(startOfMinute(new Date()), 1))
    const { assets } = await request<{ assets: Asset[] }>(
      url + "?assetsChange",
      ASSETS.CHANGE,
      { timestamp: yesterday }
    )

    return (token: string) => {
      const asset = assets.find((asset) => asset.token === token)
      if (asset) {
        const { price, priceAt, oraclePrice, oraclePriceAt } = asset.prices

        return {
          [PriceKey.PAIR]: calcChange({
            today: price,
            yesterday: priceAt ?? undefined,
          }),
          [PriceKey.ORACLE]: calcChange({
            today: oraclePrice,
            yesterday: oraclePriceAt ?? undefined,
          }),
        }
      } else {
        return {
          [PriceKey.PAIR]: undefined,
          [PriceKey.ORACLE]: undefined,
        }
      }
    }
  },
})

/* helpers */
export const assetsHelpersQuery = selectorFamily({
  key: "assetsHelpers",
  get:
    (network: StatsNetwork) =>
    ({ get }) => {
      get(locationKeyState)
      const assets = get(assetsQuery(network))

      const getValueFromAsset = (key: string) => (token: string) =>
        path(key.split("."), assets[token]) as string

      return {
        [PriceKey.PAIR]: getValueFromAsset("prices.price"),
        [PriceKey.ORACLE]: getValueFromAsset("prices.oraclePrice"),
        description: getValueFromAsset("description"),
        liquidity: getValueFromAsset("statistic.liquidity"),
        volume: getValueFromAsset("statistic.volume"),
        longAPR: getValueFromAsset("statistic.apr.long"),
        shortAPR: getValueFromAsset("statistic.apr.short"),
      }
    },
})

export const findChangeQuery = selector({
  key: "findChange",
  get: ({ get }) => {
    const change = get(getChangesQuery)

    return (key: string, token: string) => {
      if (!(key === PriceKey.PAIR || key === PriceKey.ORACLE)) return

      return change(token)[key]
    }
  },
})

/* hooks */
export const useAssetsHelpers = (network = StatsNetwork.TERRA) => {
  return useRecoilValue(assetsHelpersQuery(network))
}

export const useGetChange = () => {
  const loadable = useRecoilValueLoadable(getChangesQuery)
  return loadable.state === "hasValue" ? loadable.contents : undefined
}

export const useFindChange = () => {
  const loadable = useRecoilValueLoadable(findChangeQuery)
  return loadable.state === "hasValue" ? loadable.contents : undefined
}

export const useAssetsHistory = () => {
  const loadable = useRecoilValueLoadable(assetsHistoryQuery)
  return loadable.state === "hasValue" ? loadable.contents : undefined
}

/* utils */
type Params = { yesterday?: string; today?: string }
export const calcChange = ({ yesterday, today }: Params) => {
  const result = number(div(minus(today, yesterday), yesterday))
  return [yesterday, today, result].every(isFinite) && gt(result, -1)
    ? result
    : undefined
}
