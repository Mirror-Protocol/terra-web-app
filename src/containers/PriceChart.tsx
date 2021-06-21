import { Fragment, useMemo, useState } from "react"
import classNames from "classnames/bind"
import { startOfMinute, subDays, subMonths, subWeeks, subYears } from "date-fns"

import { format, formatAsset } from "../libs/parse"
import { div, minus } from "../libs/math"
import { percent } from "../libs/num"
import { PriceKey } from "../hooks/contractKeys"
import { useAssetHistory } from "../data/stats/asset"
import { useAssetsHelpersByNetwork, useFindChange } from "../data/stats/assets"
import Change from "../components/Change"
import AssetItem from "../components/AssetItem"
import { CardMain } from "../components/Card"

import ChartContainer from "./ChartContainer"
import PriceChartDescription from "./PriceChartDescription"
import styles from "./PriceChart.module.scss"

const cx = classNames.bind(styles)

const PriceChart = ({ token, symbol }: { token: string; symbol: string }) => {
  const now = startOfMinute(new Date())
  const findChange = useFindChange()
  const helpers = useAssetsHelpersByNetwork()

  /* request */
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

  const [range, setRange] = useState(ranges[2])
  const { interval, from } = range
  const to = now.getTime()
  const params = useMemo(
    () => ({ token, interval, from, to }),
    [token, interval, from, to]
  )

  const history = useAssetHistory(params)

  /* render */
  const price = helpers.pair(token)
  const oraclePrice = helpers.oracle(token)
  const volume = helpers.volume(token)
  const liquidity = helpers.liquidity(token)
  const description = helpers.description(token)
  const premium = oraclePrice ? minus(div(price, oraclePrice), 1) : undefined
  const change = findChange(PriceKey.PAIR, token)

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
        <PriceChartDescription key={token}>{description}</PriceChartDescription>
      </section>
    </div>
  )
}

export default PriceChart
