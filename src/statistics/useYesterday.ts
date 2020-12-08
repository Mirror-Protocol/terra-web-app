import { useQuery } from "@apollo/client"
import { getTime, startOfMinute, subDays } from "date-fns"
import { minus, div, gt, isFinite } from "../libs/math"
import { dict } from "../graphql/useNormalize"
import { useContractsAddress } from "../hooks/useContractsAddress"
import { PriceKey } from "../hooks/contractKeys"
import { prices } from "./gqldocs"
import { useStats } from "./useStats"
import useStatsClient from "./useStatsClient"

export default () => {
  const { yesterday, store } = useStats()

  const { listed } = useContractsAddress()
  const query = prices(
    listed.map(({ token }) => token),
    getTime(subDays(startOfMinute(new Date()), 1))
  )

  const client = useStatsClient()
  const result = useQuery<YesterdayData>(query, {
    client,
    onCompleted: (data) => store.yesterday(parse(data)),
  })

  return { ...result, ...yesterday }
}

/* calc */
type Params = { yesterday?: string; today?: string }
export const calcChange = ({ yesterday, today }: Params) => {
  const result = div(minus(today, yesterday), yesterday)
  return [yesterday, today, result].every(isFinite) && gt(result, -1)
    ? result
    : undefined
}

/* parse yesterday */
const parse = (data?: YesterdayData) => ({
  [PriceKey.PAIR]: data
    ? dict(data, ({ prices }) => prices.priceAt || undefined)
    : {},
  [PriceKey.ORACLE]: data
    ? dict(data, ({ prices }) => prices.oraclePriceAt || undefined)
    : {},
})
