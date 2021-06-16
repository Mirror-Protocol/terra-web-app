import { useRecoilState } from "recoil"
import { sort } from "ramda"

import { number } from "../../libs/math"
import { lookup } from "../../libs/parse"
import { StatsNetwork } from "../../data/stats/statistic"
import { dashboardNetworkState } from "../../data/stats/statistic"

import Page from "../../components/Page"
import Masonry from "../../components/Masonry"
import { bound } from "../../components/Boundary"
import ChartContainer from "../../containers/ChartContainer"
import Card from "../../components/Card"
import { MenuKey } from "../../routes"

import MIRPrice from "./MIRPrice"
import MIRSupply from "./MIRSupply"
import TVL from "./TVL"
import LiquidityHistoryChart from "./LiquidityHistoryChart"
import VolumeHistoryChart from "./VolumeHistoryChart"
import DashboardFooter from "./DashboardFooter"
import TVLTotal from "./TVLTotal"
import styles from "./Dashboard.module.scss"

const fallback = <Card lg />

const Dashboard = () => {
  const [network, setNetwork] = useRecoilState(dashboardNetworkState)

  const select = (
    <select
      value={network}
      onChange={(e) => setNetwork(e.target.value as StatsNetwork)}
    >
      {Object.entries(StatsNetwork).map(([key, value]) => (
        <option value={value} key={key}>
          {value === StatsNetwork.COMBINE ? "Terra + ETH" : value}
        </option>
      ))}
    </select>
  )

  return (
    <Page
      title={MenuKey.DASHBOARD}
      select={select}
      doc={"/user-guide/getting-started"}
    >
      <section className={styles.mobile}>{bound(<TVLTotal />)}</section>

      <Masonry>
        {[
          [
            { flex: 6, component: bound(<TVL />, fallback) },
            { flex: 3, component: bound(<MIRPrice />, fallback) },
            { flex: 7, component: bound(<MIRSupply />, fallback) },
          ],
          [
            { component: bound(<LiquidityHistoryChart />, fallback) },
            { component: bound(<VolumeHistoryChart />, fallback) },
          ],
        ]}
      </Masonry>

      <section className={styles.mobile}>{bound(<MIRPrice />)}</section>
      <footer className={styles.footer}>{bound(<DashboardFooter />)}</footer>
    </Page>
  )
}

export default Dashboard

/* helpers */
export const sortByTimestamp = (data: ChartItem[]) =>
  sort(({ timestamp: a }, { timestamp: b }) => a - b, data)

export const toDatasets = (data: ChartItem[], symbol?: string) =>
  data.map(({ timestamp, value }) => {
    return { x: timestamp, y: number(lookup(value, symbol, { integer: true })) }
  })

export const renderChart = (data: ChartItem[], bar?: boolean) => (
  <ChartContainer datasets={data ? toDatasets(data, "uusd") : []} bar={bar} />
)
