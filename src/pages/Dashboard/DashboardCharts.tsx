import { last, sort } from "ramda"
import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { lookup } from "../../libs/parse"
import { calcChange } from "../../statistics/useYesterday"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import ChartContainer from "../../containers/ChartContainer"
import { TooltipIcon } from "../../components/Tooltip"

const DashboardCharts = (props: Partial<Dashboard>) => {
  const { latest24h, liquidityHistory, tradingVolumeHistory } = props

  return (
    <Grid wrap={2}>
      <Card>
        <Summary
          title={
            <TooltipIcon content={Tooltip.Chart.Liquidity}>
              Liquidity
            </TooltipIcon>
          }
        >
          <ChartContainer
            value={
              <Count symbol={UUSD} integer>
                {liquidityHistory
                  ? last(sortByTimestamp(liquidityHistory))?.value
                  : "0"}
              </Count>
            }
            change={
              liquidityHistory && liquidityHistory.length >= 2
                ? calcChange({
                    yesterday:
                      liquidityHistory[liquidityHistory.length - 2]?.value,
                    today: liquidityHistory[liquidityHistory.length - 1]?.value,
                  })
                : undefined
            }
            datasets={
              liquidityHistory ? toDatasets(liquidityHistory, UUSD) : []
            }
          />
        </Summary>
      </Card>

      <Card>
        <Summary
          title={
            <TooltipIcon content={Tooltip.Chart.Volume}>Volume</TooltipIcon>
          }
        >
          <ChartContainer
            value={
              <Count symbol={UUSD} integer>
                {latest24h?.volume}
              </Count>
            }
            datasets={
              tradingVolumeHistory ? toDatasets(tradingVolumeHistory, UUSD) : []
            }
            bar
          />
        </Summary>
      </Card>
    </Grid>
  )
}

export default DashboardCharts

/* helpers */
const sortByTimestamp = (data: ChartItem[]) =>
  sort(({ timestamp: a }, { timestamp: b }) => a - b, data)

const toDatasets = (data: ChartItem[], symbol?: string) =>
  data.map(({ timestamp, value }) => {
    return { t: timestamp, y: lookup(value, symbol, { integer: true }) }
  })
