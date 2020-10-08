import { useQuery } from "@apollo/client"
import { getTime, startOfMinute, subDays } from "date-fns"
import { STATISTICS } from "./gqldocs"
import { useStats, useStatsClient } from "./useStats"

export default () => {
  const { dashboard, store } = useStats()

  const now = getTime(startOfMinute(new Date()))
  const genesis = getTime(startOfMinute(subDays(new Date(), 100)))
  const client = useStatsClient()

  const result = useQuery<{ statistic: Dashboard }>(STATISTICS, {
    variables: { from: genesis, to: now },
    client,
    onCompleted: ({ statistic }) => store.dashboard(statistic),
  })

  return { ...result, dashboard }
}
