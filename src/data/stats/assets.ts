import { atom, atomFamily, selector, selectorFamily } from "recoil"
import { request } from "graphql-request"
import { path } from "ramda"
import { getTime, startOfMinute, subDays } from "date-fns"
import { minus, div, gt, isFinite, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useStoreLoadable } from "../utils/loadable"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { StatsNetwork } from "./statistic"
import { ASSETS } from "./gqldocs"

export const assetsByNetworkQuery = selectorFamily({
  key: "assetsByNetwork",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)

      const { assets } = await request<{ assets: AssetDataItem[] }>(
        `${url}?assetsStats:${network.toUpperCase()}`,
        ASSETS.STATS,
        { network: network.toUpperCase() }
      )

      return assets.reduce<Dictionary<AssetDataItem>>(
        (acc, asset) => ({ ...acc, [asset.token]: asset }),
        {}
      )
    },
})

export const assetsByNetworkState = atomFamily<
  Dictionary<AssetDataItem>,
  StatsNetwork
>({
  key: "assetsByNetworkState",
  default: {},
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
      { interval: 30, from: subDays(now, 1).getTime(), to: now.getTime() }
    )

    return assets.reduce<Dictionary<PriceHistoryItem[]>>(
      (acc, { token, prices: { history } }) => ({ ...acc, [token]: history }),
      {}
    )
  },
})

const assetsHistoryState = atom<Dictionary<PriceHistoryItem[]>>({
  key: "assetsHistoryState",
  default: {},
})

type Changes =
  | { [PriceKey.PAIR]?: number; [PriceKey.ORACLE]?: number }
  | undefined

export const changesQuery = selector({
  key: "changes",
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
      url + "?assetsChanges",
      ASSETS.CHANGE,
      { timestamp: yesterday }
    )

    return assets.reduce<Dictionary<Changes>>((acc, { token, prices }) => {
      const { price, priceAt, oraclePrice, oraclePriceAt } = prices
      return {
        ...acc,
        [token]: {
          [PriceKey.PAIR]: calcChange({
            today: price,
            yesterday: priceAt ?? undefined,
          }),
          [PriceKey.ORACLE]: calcChange({
            today: oraclePrice,
            yesterday: oraclePriceAt ?? undefined,
          }),
        },
      }
    }, {})
  },
})

const changesState = atom<Dictionary<Changes>>({
  key: "changesState",
  default: {},
})

/* hooks */
export const useAssetsByNetwork = (network = StatsNetwork.TERRA) => {
  return useStoreLoadable(
    assetsByNetworkQuery(network),
    assetsByNetworkState(network)
  )
}

export const useAssetsHelpersByNetwork = (network = StatsNetwork.TERRA) => {
  const assets = useAssetsByNetwork(network)
  return getAssetsHelpers(assets)
}

export const getAssetsHelpers = (assets: Dictionary<AssetDataItem>) => {
  const getValueFromAsset = (key: string) => (token: string) =>
    path(key.split("."), assets[token]) as string

  return {
    description: getValueFromAsset("description"),
    liquidity: getValueFromAsset("statistic.liquidity"),
    volume: getValueFromAsset("statistic.volume"),
    marketCap: getValueFromAsset("statistic.marketCap"),
    collateralValue: getValueFromAsset("statistic.collateralValue"),
    minCollateralRatio: getValueFromAsset("statistic.minCollateralRatio"),
    longAPR: getValueFromAsset("statistic.apr.long"),
    shortAPR: getValueFromAsset("statistic.apr.short"),
  }
}

export const useChanges = () => {
  return useStoreLoadable(changesQuery, changesState)
}

export const useFindChanges = () => {
  const changes = useChanges()
  return (token: string) => changes[token] ?? {}
}

export const useFindChange = () => {
  const findChanges = useFindChanges()
  return (key: PriceKey, token: string) => {
    if (!hasChanges(key)) return
    const changes = findChanges(token)
    return changes[key]
  }
}

export const useAssetsHistory = () => {
  return useStoreLoadable(assetsHistoryQuery, assetsHistoryState)
}

/* utils */
type Params = { yesterday?: string; today?: string }
export const calcChange = ({ yesterday, today }: Params) => {
  const result = number(div(minus(today, yesterday), yesterday))
  return [yesterday, today, result].every(isFinite) && gt(result, -1)
    ? result
    : undefined
}

export const hasChanges = (
  key: PriceKey
): key is PriceKey.PAIR | PriceKey.ORACLE =>
  key === PriceKey.PAIR || key === PriceKey.ORACLE
