import { useRecoilValue } from "recoil"
import { last } from "ramda"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"
import { calcChange } from "../../data/stats/assets"
import { dashboardNetworkState } from "../../data/stats/statistic"
import { statisticHistoryQuery } from "../../data/stats/statistic"
import { renderChart, sortByTimestamp } from "./Dashboard"

const LiquidityHistoryChart = () => {
  const network = useRecoilValue(dashboardNetworkState)
  const history = useRecoilValue(statisticHistoryQuery(network))

  const getChange = (history: ChartItem[]) =>
    history && history.length >= 2
      ? calcChange({
          yesterday: history[history.length - 2]?.value,
          today: history[history.length - 1]?.value,
        })
      : undefined

  const chart = renderChart(history.liquidityHistory)

  return (
    <Card title="Liquidity" full lg footer={chart}>
      <CardMain>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {history.liquidityHistory
            ? last(sortByTimestamp(history.liquidityHistory))?.value
            : "0"}
        </Formatted>

        <Change>{getChange(history.liquidityHistory)}</Change>
      </CardMain>
    </Card>
  )
}

export default LiquidityHistoryChart
