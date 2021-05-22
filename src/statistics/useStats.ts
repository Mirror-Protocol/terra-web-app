import { Dispatch, SetStateAction, useState } from "react"
import createContext from "../hooks/createContext"
import { StatsNetwork } from "./useDashboard"

type DashboardByNetwork = Record<StatsNetwork, Dashboard | undefined>

interface Stats {
  getDashboard: (network: StatsNetwork) => Dashboard | undefined
  assets: AssetStats
  yesterday: Yesterday
  store: {
    dashboard: (data: Partial<DashboardByNetwork>) => void
    assets: Dispatch<SetStateAction<AssetStats>>
    yesterday: Dispatch<SetStateAction<Yesterday>>
  }
}

const stats = createContext<Stats>("useStats")
export const [useStats, StatsProvider] = stats

/* state */
export const useStatsState = (): Stats => {
  const initialAssets = {
    description: {},
    liquidity: {},
    volume: {},
    apr: {},
    apy: {},
  }

  const initialYesterday = { pair: {}, oracle: {} }
  const initDashboard = () =>
    Object.keys(StatsNetwork).reduce(
      (acc, key) => ({ ...acc, [key]: undefined }),
      {} as DashboardByNetwork
    )

  const [dashboard, setDashboard] = useState<DashboardByNetwork>(initDashboard)
  const [assets, setAssets] = useState<AssetStats>(initialAssets)
  const [yesterday, setYesterday] = useState<Yesterday>(initialYesterday)

  const getDashboard = (network: StatsNetwork) => dashboard[network]
  const store = {
    dashboard: (data: Partial<DashboardByNetwork>) =>
      setDashboard((dashboard) => ({ ...dashboard, ...data })),
    assets: setAssets,
    yesterday: setYesterday,
  }

  return { getDashboard, assets, yesterday, store }
}
