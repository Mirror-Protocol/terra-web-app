import { Dispatch, SetStateAction, useState } from "react"
import createContext from "../hooks/createContext"
import { StatsNetwork } from "./useDashboard"

type ByNetwork<T> = Record<StatsNetwork, T | undefined>

interface Stats {
  getDashboard: (network: StatsNetwork) => Dashboard | undefined
  getAssets: (network: StatsNetwork) => AssetStats | undefined
  yesterday: Yesterday

  store: {
    dashboard: (data: Dashboard, network: StatsNetwork) => void
    assets: (data: AssetStats, network: StatsNetwork) => void
    yesterday: Dispatch<SetStateAction<Yesterday>>
  }
}

const stats = createContext<Stats>("useStats")
export const [useStats, StatsProvider] = stats

/* state */
export const useStatsState = (): Stats => {
  const initialYesterday = { pair: {}, oracle: {} }
  const init = () =>
    Object.keys(StatsNetwork).reduce(
      (acc, key) => ({ ...acc, [key]: undefined }),
      {} as ByNetwork<any>
    )

  const [dashboard, setDashboard] = useState<ByNetwork<Dashboard>>(init)
  const [assets, setAssets] = useState<ByNetwork<AssetStats>>(init)
  const [yesterday, setYesterday] = useState<Yesterday>(initialYesterday)

  const getDashboard = (network: StatsNetwork) => dashboard[network]
  const getAssets = (network: StatsNetwork) => assets[network]

  const store = {
    dashboard: (data: Dashboard, network: StatsNetwork) =>
      setDashboard((prev) => ({ ...prev, [network]: data })),
    assets: (data: AssetStats, network: StatsNetwork) =>
      setAssets((prev) => ({ ...prev, [network]: data })),
    yesterday: setYesterday,
  }

  return { getDashboard, getAssets, yesterday, store }
}
