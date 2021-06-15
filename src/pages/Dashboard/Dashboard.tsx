import { useRecoilState } from "recoil"
import { sort } from "ramda"

import { number } from "../../libs/math"
import { lookup } from "../../libs/parse"
import { StatsNetwork } from "../../data/stats/statistic"
import { useDashboard, dashboardNetworkState } from "../../data/stats/statistic"

import Page from "../../components/Page"
import Masonry from "../../components/Masonry"
import Boundary from "../../components/Boundary"
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
  const dashboard = useDashboard()

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
      <section className={styles.tvl}>
        <TVLTotal {...dashboard.totalValueLocked} />
      </section>

      <Masonry>
        {[
          [
            { flex: 3, component: <MIRPrice /> },
            { flex: 7, component: <MIRSupply {...dashboard.mirSupply} /> },
            { flex: 6, component: <TVL {...dashboard.totalValueLocked} /> },
          ],
          [
            {
              component: (
                <Boundary>
                  <LiquidityHistoryChart />
                </Boundary>
              ),
            },
            {
              component: (
                <Boundary>
                  <VolumeHistoryChart />
                </Boundary>
              ),
            },
          ],
        ]}
      </Masonry>

      <footer className={styles.footer}>
        <DashboardFooter {...dashboard} />
      </footer>
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
