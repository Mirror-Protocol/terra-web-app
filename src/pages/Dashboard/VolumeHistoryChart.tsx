import { useRecoilValue } from "recoil"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import { dashboardNetworkState } from "../../data/stats/statistic"
import { statisticHistoryQuery, useDashboard } from "../../data/stats/statistic"
import { renderChart } from "./Dashboard"

const VolumeHistoryChart = () => {
  const network = useRecoilValue(dashboardNetworkState)
  const history = useRecoilValue(statisticHistoryQuery(network))
  const dashboard = useDashboard()

  const chart = renderChart(history.tradingVolumeHistory, true)

  return (
    <Card title="Volume" full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {dashboard.latest24h.volume}
        </Formatted>
      </CardMain>
    </Card>
  )
}

export default VolumeHistoryChart
