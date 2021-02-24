import { MenuKey } from "../routes"
import useDashboard, { StatsNetwork } from "../statistics/useDashboard"
import Page from "../components/Page"
import Grid from "../components/Grid"
import DashboardHeader from "./Dashboard/DashboardHeader"
import DashboardCharts from "./Dashboard/DashboardCharts"
import TopTrading from "./Dashboard/TopTrading"

const Dashboard = () => {
  const { dashboard, network, setNetwork } = useDashboard(StatsNetwork.COMBINE)

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
      <DashboardHeader {...dashboard} network={network} />
      <DashboardCharts {...dashboard} />

      <Grid>
        <TopTrading network={network} />
      </Grid>
    </Page>
  )
}

export default Dashboard
