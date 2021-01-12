import { useState } from "react"
import classNames from "classnames/bind"
import { useQuery } from "@apollo/client"
import { startOfMinute, subDays, subMonths, subWeeks, subYears } from "date-fns"

import { format } from "../libs/parse"
import Change from "../components/Change"

import { UST } from "../constants"
import { PRICEHISTORY } from "../statistics/gqldocs"
import useStatsClient from "../statistics/useStatsClient"
import { calcChange } from "../statistics/useYesterday"
import useAssetStats from "../statistics/useAssetStats"
import ChartContainer from "./ChartContainer"
import PriceChartDescription from "./PriceChartDescription"
import styles from "./PriceChart.module.scss"

const cx = classNames.bind(styles)

interface Item {
  timestamp: number
  price: number
}

interface Data {
  price: string
  priceAt: string
  history: Item[]
}

interface Response {
  asset: { prices: Data }
}

const PriceChart = ({ token, symbol }: { token: string; symbol: string }) => {
  const now = startOfMinute(new Date())
  const yesterday = subDays(now, 1).getTime()
  const { description } = useAssetStats()

  const ranges = [
    {
      label: "D",
      interval: 60 / 4, // 15 minutes
      from: subDays(now, 1).getTime(),
      fmt: "EEE, LLL dd, HH:mm aa",
    },
    {
      label: "W",
      interval: 60 * 1, // 1 hour
      from: subWeeks(now, 1).getTime(),
      fmt: "EEE, LLL dd, HH:mm aa",
    },
    {
      label: "M",
      interval: 60 * 24, // 1 day
      from: subMonths(now, 1).getTime(),
      fmt: "LLL dd, yyyy",
    },
    {
      label: "Y",
      interval: 60 * 24 * 7, // 1 week
      from: subYears(now, 1).getTime(),
      fmt: "LLL dd, yyyy",
    },
  ]

  /* request */
  const [range, setRange] = useState(ranges[2])
  const [data, setDate] = useState<Data>()
  const params = { token, ...range, to: now.getTime(), yesterday }

  const client = useStatsClient()
  useQuery<Response>(PRICEHISTORY, {
    client,
    variables: params,
    skip: !token,
    onCompleted: (data) => setDate(data.asset.prices),
  })

  /* render */
  const change = calcChange({ today: data?.price, yesterday: data?.priceAt })

  return !data ? null : (
    <div className={styles.component}>
      <header className={styles.header}>
        <section className={styles.token}>
          <span className={styles.symbol}>{symbol}</span>
          <Change
            className={styles.price}
            price={`${format(data.price)} ${UST}`}
          >
            {change}
          </Change>
        </section>

        <section className={styles.ranges}>
          {ranges.map((r) => (
            <button
              type="button"
              className={cx(styles.button, { active: r.label === range.label })}
              onClick={() => setRange(r)}
              key={r.label}
            >
              {r.label}
            </button>
          ))}
        </section>
      </header>

      <div className={styles.chart}>
        <ChartContainer
          change={change}
          datasets={data.history?.map(({ timestamp: t, price: y }) => ({
            y,
            t,
          }))}
          fmt={{ t: range.fmt }}
          compact
        />
      </div>

      <section className={styles.description}>
        <PriceChartDescription key={token}>
          {description[token]}
        </PriceChartDescription>
      </section>
    </div>
  )
}

export default PriceChart
