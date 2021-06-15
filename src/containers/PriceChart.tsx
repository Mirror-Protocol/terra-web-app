import { Fragment, useEffect, useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import classNames from "classnames/bind"
import { startOfMinute, subDays, subMonths, subWeeks, subYears } from "date-fns"

import { format, formatAsset } from "../libs/parse"
import { div, minus } from "../libs/math"
import { percent } from "../libs/num"
import { getAssetQuery } from "../data/stats/asset"
import { calcChange, useAssetsHelpers } from "../data/stats/assets"
import Change from "../components/Change"
import AssetItem from "../components/AssetItem"
import { CardMain } from "../components/Card"

import ChartContainer from "./ChartContainer"
import PriceChartDescription from "./PriceChartDescription"
import styles from "./PriceChart.module.scss"

const cx = classNames.bind(styles)

const PriceChart = ({ token, symbol }: { token: string; symbol: string }) => {
  const now = startOfMinute(new Date())
  const yesterday = subDays(now, 1).getTime()
  const { description } = useAssetsHelpers()

  const ranges = [
    {
      label: "Day",
      interval: 60 / 4, // 15 minutes
      from: subDays(now, 1).getTime(),
      fmt: "EEE, LLL dd, HH:mm aa",
    },
    {
      label: "Week",
      interval: 60 * 1, // 1 hour
      from: subWeeks(now, 1).getTime(),
      fmt: "EEE, LLL dd, HH:mm aa",
    },
    {
      label: "Month",
      interval: 60 * 24, // 1 day
      from: subMonths(now, 1).getTime(),
      fmt: "LLL dd, yyyy",
    },
    {
      label: "Year",
      interval: 60 * 24 * 7, // 1 week
      from: subYears(now, 1).getTime(),
      fmt: "LLL dd, yyyy",
    },
  ]

  /* request */
  const [range, setRange] = useState(ranges[2])
  const [data, setData] = useState<AssetData>()
  const { interval, from } = range
  const to = now.getTime()
  const params = useMemo(
    () => ({ token, interval, from, to, yesterday }),
    [token, interval, from, to, yesterday]
  )

  const getAsset = useRecoilValue(getAssetQuery)
  useEffect(() => {
    const load = async () => {
      const data = await getAsset(params)
      setData(data)
    }

    load()
  }, [params, getAsset])

  /* render */
  if (!data) return null

  const { prices, statistic } = data
  const { price, priceAt, history, oraclePrice } = prices
  const { volume, liquidity } = statistic
  const premium = oraclePrice ? minus(div(price, oraclePrice), 1) : undefined

  const change = calcChange({ today: price, yesterday: priceAt })
  const details = [
    {
      title: "Oracle Price",
      content: oraclePrice ? `${format(oraclePrice)} UST` : undefined,
    },
    { title: "Premium", content: premium ? percent(premium) : undefined },
    { title: "Volume", content: formatAsset(volume, "uusd") },
    { title: "Liquidity", content: formatAsset(liquidity, "uusd") },
  ]

  return (
    <div className={styles.component}>
      <CardMain>
        <AssetItem token={token}>
          <p>{format(price)} UST</p>
          <Change inline>{change}</Change>
        </AssetItem>

        <dl className={styles.details}>
          {details.map(
            ({ title, content }) =>
              content && (
                <Fragment key={title}>
                  <dt>{title}</dt>
                  <dd>{content}</dd>
                </Fragment>
              )
          )}
        </dl>
      </CardMain>

      <div className={styles.chart}>
        <ChartContainer
          change={change}
          datasets={history?.map(({ timestamp, price }) => ({
            y: Number(price),
            x: timestamp,
          }))}
          fmt={{ t: range.fmt }}
        />
      </div>

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

      <section className={styles.footer}>
        <PriceChartDescription key={token}>
          {description(token)}
        </PriceChartDescription>
      </section>
    </div>
  )
}

export default PriceChart
