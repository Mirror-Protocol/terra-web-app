import { Dispatch, SetStateAction, useState } from "react"
import createContext from "../hooks/createContext"

interface Stats {
  dashboard?: Dashboard
  assets: AssetStats
  yesterday: Yesterday
  store: {
    dashboard: Dispatch<SetStateAction<Dashboard | undefined>>
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
  const [dashboard, setDashboard] = useState<Dashboard>()
  const [assets, setAssets] = useState<AssetStats>(initialAssets)
  const [yesterday, setYesterday] = useState<Yesterday>(initialYesterday)

  const store = {
    dashboard: setDashboard,
    assets: setAssets,
    yesterday: setYesterday,
  }

  return { dashboard, assets, yesterday, store }
}
