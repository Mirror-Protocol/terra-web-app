import { atom, atomFamily, selectorFamily, useRecoilValue } from "recoil"
import { request } from "graphql-request"
import { getTime, startOfMinute, subDays } from "date-fns"
import { useStoreLoadable } from "../utils/loadable"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { STATISTIC } from "./gqldocs"

export enum StatsNetwork {
  COMBINE = "COMBINE",
  TERRA = "Terra",
  ETH = "ETH",
}

export const dashboardNetworkState = atom({
  key: "dashboardNetworkState",
  default: StatsNetwork.COMBINE,
})

export const statisticByNetworkQuery = selectorFamily({
  key: "statisticByNetwork",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const variables = { network: network.toUpperCase() }

      const { statistic } = await request<{ statistic: Dashboard }>(
        `${url}?dashboard:${network.toUpperCase()}`,
        STATISTIC.DASHBOARD,
        variables
      )

      return statistic
    },
})

const statisticByNetworkState = atomFamily({
  key: "statisticByNetworkState",
  default: {
    assetMarketCap: "0",
    govAPR: "0",
    mirPrice: "0",
    mirSupply: {
      circulating: "0",
      liquidity: "0",
      staked: "0",
    },
    totalValueLocked: {
      total: "0",
      liquidity: "0",
      collateral: "0",
      stakedMir: "0",
    },
    latest24h: {
      transactions: "0",
      volume: "0",
      feeVolume: "0",
    },
  },
})

export const statisticHistoryByNetworkQuery = selectorFamily({
  key: "statisticHistoryByNetwork",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const variables = {
        from: getTime(startOfMinute(subDays(new Date(), 100))),
        to: getTime(startOfMinute(new Date())),
        network: network.toUpperCase(),
      }

      const { statistic } = await request<{ statistic: DashboardHistory }>(
        `${url}?history:${network.toUpperCase()}`,
        STATISTIC.HISTORY,
        variables
      )

      return statistic
    },
})

const statisticHistoryByNetworkState = atomFamily<
  DashboardHistory,
  StatsNetwork
>({
  key: "statisticHistoryByNetworkState",
  default: {
    liquidityHistory: [],
    tradingVolumeHistory: [],
  },
})

/* hooks */
export const useDashboard = () => {
  const network = useRecoilValue(dashboardNetworkState)
  return useStoreLoadable(
    statisticByNetworkQuery(network),
    statisticByNetworkState(network)
  )
}

export const useDashboardCharts = () => {
  const network = useRecoilValue(dashboardNetworkState)
  return useStoreLoadable(
    statisticHistoryByNetworkQuery(network),
    statisticHistoryByNetworkState(network)
  )
}
