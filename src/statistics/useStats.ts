import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useNetwork } from "../hooks"
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
  const initialYesterday = { pair: {}, oracle: {} }
  const [dashboard, setDashboard] = useState<Dashboard>()
  const [assets, setAssets] = useState<AssetStats>({ volume: {}, apr: {} })
  const [yesterday, setYesterday] = useState<Yesterday>(initialYesterday)

  const store = {
    dashboard: setDashboard,
    assets: setAssets,
    yesterday: setYesterday,
  }

  return { dashboard, assets, yesterday, store }
}

/* apollo client */
export const useStatsClient = () => {
  const { stats: uri } = useNetwork()
  const client = useMemo(
    () => new ApolloClient({ uri, cache: new InMemoryCache() }),
    [uri]
  )
  return client
}
