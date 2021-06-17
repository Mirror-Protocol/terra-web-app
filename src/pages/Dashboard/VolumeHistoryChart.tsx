import Tooltips from "../../lang/Tooltips"
import { useDashboardCharts } from "../../data/stats/statistic"
import { useDashboard } from "../../data/stats/statistic"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import { TooltipIcon } from "../../components/Tooltip"
import { renderChart } from "./Dashboard"

const VolumeHistoryChart = () => {
  const { latest24h } = useDashboard()
  const { tradingVolumeHistory } = useDashboardCharts()

  const chart = renderChart(tradingVolumeHistory, true)

  const title = (
    <TooltipIcon content={Tooltips.Dashboard.Chart.Volume}>Volume</TooltipIcon>
  )

  return (
    <Card title={title} full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {latest24h.volume}
        </Formatted>
      </CardMain>
    </Card>
  )
}

export default VolumeHistoryChart
