import { useQuery } from "@apollo/client"
import { div } from "../libs/math"
import { ASSETSTATS } from "./gqldocs"
import { useStats } from "./useStats"
import useStatsClient from "./useStatsClient"

export default () => {
  const { assets, store } = useStats()
  const client = useStatsClient()

  const result = useQuery<{ assets: AssetStatsData[] }>(ASSETSTATS, {
    client,
    onCompleted: ({ assets }) => store.assets(parse(assets)),
  })

  return { ...result, ...assets }
}

/* parse */
const parse = (assets: AssetStatsData[]) => ({
  volume: assets.reduce((acc, { token, statistic }) => {
    return { ...acc, [token]: statistic.volume24h }
  }, {}),
  apr: assets.reduce((acc, { token, statistic }) => {
    return { ...acc, [token]: div(statistic.apr, 100) }
  }, {}),
})
