import { atom, selectorFamily, useRecoilValue } from "recoil"
import { request } from "graphql-request"
import { getTime, startOfMinute, subDays } from "date-fns"
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

export const statisticQuery = selectorFamily({
  key: "statistic",
  get:
    (network: StatsNetwork) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const variables = {
        network: network.toUpperCase(),
      }

      const { statistic } = await request<{ statistic: Dashboard }>(
        url + "?dashboard",
        STATISTIC.DASHBOARD,
        variables
      )

      return statistic
    },
})

export const statisticHistoryQuery = selectorFamily({
  key: "statisticHistory",
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
        url + "?history",
        STATISTIC.HISTORY,
        variables
      )

      return statistic
    },
})

export const useDashboard = () => {
  const network = useRecoilValue(dashboardNetworkState)
  return useRecoilValue(statisticQuery(network))
}
