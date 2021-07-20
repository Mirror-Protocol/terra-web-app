import { isNil, last } from "ramda"
import Tooltips from "../../lang/Tooltips"
import { calcChange } from "../../data/stats/assets"
import { useDashboardCharts } from "../../data/stats/statistic"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
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
  const change = getChange(liquidityHistory)
  const title = (
    <TooltipIcon content={Tooltips.Dashboard.Liquidity}>Liquidity</TooltipIcon>
  )

  return (
    <Card title={title} full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" integer big>
          {last(sortByTimestamp(liquidityHistory))?.value}
        </Formatted>

        <Change idle={isNil(change)}>{change}</Change>
      </CardMain>
    </Card>
  )
}

export default LiquidityHistoryChart
