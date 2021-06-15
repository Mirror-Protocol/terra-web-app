import { selector, selectorFamily, useRecoilValue } from "recoil"
import { gql, request } from "graphql-request"
import { getTime, startOfMinute, subDays } from "date-fns"
import { minus, div, gt, isFinite } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { StatsNetwork } from "./statistic"

export const assetsQuery = selectorFamily({
  key: "assets",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)

      const { assets } = await request<{ assets: AssetDataItem[] }>(
        url + "?assets",
        ASSETSTATS,
        { network: network.toUpperCase() }
      )

      return assets.reduce<Dictionary<AssetDataItem>>(
        (acc, asset) => ({ ...acc, [asset.token]: asset }),
        {}
      )
    },
})

export const assetsHistoryQuery = selectorFamily({
  key: "assetsHistory",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const now = startOfMinute(new Date())

      const { assets } = await request<{ assets: AssetHistoryItem[] }>(
        url + "?assetsHistory",
        ASSETS_HISTORY,
        { interval: 60 / 4, from: subDays(now, 1).getTime(), to: now.getTime() }
      )

      return assets.reduce<Dictionary<PriceHistoryItem[]>>(
        (acc, { token, prices: { history } }) => ({ ...acc, [token]: history }),
        {}
      )
    },
})

export const assetsHelpersQuery = selectorFamily({
  key: "assetsHelpers",
  get:
    (network: StatsNetwork) =>
    ({ get }) => {
      const assets = get(assetsQuery(network))

      return {
        description: (token: string) => assets[token]?.description,
        liquidity: (token: string) => assets[token]?.statistic.liquidity,
        shortValue: (token: string) => assets[token]?.statistic.shortValue,
        volume: (token: string) => assets[token]?.statistic.volume,
        longAPR: (token: string) => assets[token]?.statistic.apr.long,
        shortAPR: (token: string) => assets[token]?.statistic.apr.short,
      }
    },
})

export const useAssetsHelpers = (network = StatsNetwork.TERRA) => {
  return useRecoilValue(assetsHelpersQuery(network))
}

/* yesterday */
export const yesterdayQuery = selector({
  key: "yesterday",
  get: async ({ get }) => {
    get(locationKeyState)
    const url = get(statsURLQuery)
    const yesterday = getTime(subDays(startOfMinute(new Date()), 1))
    const { assets } = await request<{ assets: Asset[] }>(
      url + "?yesterday",
      YESTERDAY,
      { timestamp: yesterday }
    )

    return assets.reduce<Dictionary<{ pair?: string; oracle?: string }>>(
      (acc, { token, prices: { priceAt, oraclePriceAt } }) => ({
        ...acc,
        [token]: {
          pair: priceAt ?? undefined,
          oracle: oraclePriceAt ?? undefined,
        },
      }),
      {}
    )
  },
})

export const findChangeQuery = selector({
  key: "findChange",
  get: ({ get }) => {
    const yesterday = get(yesterdayQuery)
    return (key: PriceKey) => (token: string, price: string) =>
      key === PriceKey.PAIR || key === PriceKey.ORACLE
        ? calcChange({ yesterday: yesterday[token]?.[key], today: price })
        : undefined
  },
})

export const useFindChange = () => {
  return useRecoilValue(findChangeQuery)
}

/* docs */
const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description

      statistic {
        liquidity(network: $network)
        shortValue(network: $network)
        volume(network: $network)
        apr {
          long
          short
        }
      }
    }
  }
`
const ASSETS_HISTORY = gql`
  query assets($interval: Float!, $from: Float!, $to: Float!) {
    assets {
      token

      prices {
        history(interval: $interval, from: $from, to: $to) {
          timestamp
          price
        }
      }
    }
  }
`

interface Asset {
  token: string
  prices: {
    priceAt: string | null
    oraclePriceAt: string | null
  }
}

const YESTERDAY = gql`
  query assets($timestamp: Float!) {
    assets {
      token
      prices {
        priceAt(timestamp: $timestamp)
        oraclePriceAt(timestamp: $timestamp)
      }
    }
  }
`

/* helper */
type Params = { yesterday?: string; today?: string }
export const calcChange = ({ yesterday, today }: Params) => {
  const result = div(minus(today, yesterday), yesterday)
  return [yesterday, today, result].every(isFinite) && gt(result, -1)
    ? result
    : undefined
}
