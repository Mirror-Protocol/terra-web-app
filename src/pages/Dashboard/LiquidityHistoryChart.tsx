import { last } from "ramda"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"
import { calcChange } from "../../data/stats/assets"
import { useDashboardCharts } from "../../data/stats/statistic"
import { renderChart, sortByTimestamp } from "./Dashboard"

const LiquidityHistoryChart = () => {
  const { liquidityHistory } = useDashboardCharts()

  const getChange = (history: ChartItem[]) =>
    history && history.length >= 2
      ? calcChange({
          yesterday: history[history.length - 2]?.value,
          today: history[history.length - 1]?.value,
        })
      : undefined

  const chart = renderChart(liquidityHistory)

  return (
    <Card title="Liquidity" full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {last(sortByTimestamp(liquidityHistory))?.value}
        </Formatted>

        <Change>{getChange(liquidityHistory)}</Change>
      </CardMain>
    </Card>
  )
}

export default LiquidityHistoryChart
