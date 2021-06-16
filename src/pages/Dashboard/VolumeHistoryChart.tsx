import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import { useDashboardCharts } from "../../data/stats/statistic"
import { useDashboard } from "../../data/stats/statistic"
import { renderChart } from "./Dashboard"

const VolumeHistoryChart = () => {
  const { latest24h } = useDashboard()
  const { tradingVolumeHistory } = useDashboardCharts()

  const chart = renderChart(tradingVolumeHistory, true)

  return (
    <Card title="Volume" full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {latest24h.volume}
        </Formatted>
      </CardMain>
    </Card>
  )
}

export default VolumeHistoryChart
