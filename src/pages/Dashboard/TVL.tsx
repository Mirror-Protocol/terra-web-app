import Tooltips from "../../lang/Tooltips"
import { number } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useDashboard } from "../../data/stats/statistic"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import { TooltipIcon } from "../../components/Tooltip"
import RatioChart from "../../containers/RatioChart"
import styles from "./TVL.module.scss"

const TVL = () => {
  const { totalValueLocked } = useDashboard()
  const { total, liquidity, collateral, stakedMir } = totalValueLocked

  const list = [
    {
      label: "Collateral",
      tooltip: Tooltips.Dashboard.Collateral,
      value: number(collateral),
    },
    {
      label: "Staked MIR",
      tooltip: Tooltips.Dashboard.Staked,
      value: number(stakedMir),
    },
    {
      label: "Liquidity",
      tooltip: Tooltips.Dashboard.Liquidity,
      value: number(liquidity),
    },
  ].sort(({ value: a }, { value: b }) => b - a)

  return (
    <Card
      title={
        <TooltipIcon content={Tooltips.Dashboard.TVL}>
          Total Value Locked
        </TooltipIcon>
      }
      lg
    >
      <Formatted symbol="uusd" config={{ integer: true }} big>
        {total}
      </Formatted>

      <section className={styles.chart}>
        <RatioChart
          list={list}
          format={(value) => formatAsset(String(value), "uusd")}
        />
      </section>
    </Card>
  )
}

export default TVL
