import { ChangeEvent } from "react"
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
import { MenuKey } from "../../routes"

import MIRPrice from "./MIRPrice"
import MIRSupply from "./MIRSupply"
import TVL from "./TVL"
import LiquidityHistoryChart from "./LiquidityHistoryChart"
import VolumeHistoryChart from "./VolumeHistoryChart"
import DashboardFooter from "./DashboardFooter"
import TVLTotal from "./TVLTotal"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const [network, setNetwork] = useRecoilState(dashboardNetworkState)

  const selectAttrs = {
    attrs: {
      value: network,
      onChange: (e: ChangeEvent<HTMLSelectElement>) =>
        setNetwork(e.target.value as StatsNetwork),
    },
    options: Object.entries(StatsNetwork).map(([key, value]) => ({
      value,
      children: value === StatsNetwork.COMBINE ? "Terra + ETH" : value,
    })),
  }

  return (
    <Page
      title={MenuKey.DASHBOARD}
      select={selectAttrs}
      doc={"/user-guide/getting-started"}
    >
      <section className={styles.mobile}>{bound(<TVLTotal />)}</section>

      <Masonry>
        {[
          [
            { component: bound(<TVL />), flex: "none" },
            { component: bound(<MIRPrice />), flex: "none" },
            { component: bound(<MIRSupply />), flex: 1 },
          ],
          [
            { component: bound(<LiquidityHistoryChart />), flex: "none" },
            { component: bound(<VolumeHistoryChart />), flex: 1 },
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
