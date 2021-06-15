import { atom, selectorFamily, useRecoilValue } from "recoil"
import { gql, request } from "graphql-request"
import { getTime, startOfMinute, subDays } from "date-fns"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"

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
        url + "?statistic",
        STATISTIC,
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
        STATISTIC_HISTORY,
        variables
      )

      return statistic
    },
})

export const useDashboard = () => {
  const network = useRecoilValue(dashboardNetworkState)
  return useRecoilValue(statisticQuery(network))
}

/* docs */
const STATISTIC = gql`
  query statistic($network: Network) {
    statistic(network: $network) {
      assetMarketCap
      collateralRatio
      govAPR

      mirSupply {
        circulating
        liquidity
        staked
      }

      totalValueLocked {
        total
        liquidity
        collateral
        stakedMir
      }

      latest24h {
        transactions
        volume
        feeVolume
        mirVolume
      }
    }
  }
`

const STATISTIC_HISTORY = gql`
  query statistic($from: Float!, $to: Float!, $network: Network) {
    statistic(network: $network) {
      liquidityHistory(from: $from, to: $to) {
        timestamp
        value
      }

      tradingVolumeHistory(from: $from, to: $to) {
        timestamp
        value
      }
    }
  }
`
