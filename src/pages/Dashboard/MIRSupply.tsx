import Tooltips from "../../lang/Tooltips"
import { minus, plus } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useDashboard } from "../../data/stats/statistic"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import DoughnutChart from "../../containers/DoughnutChart"

const MIRSupply = () => {
  const { mirSupply } = useDashboard()
  const { circulating, liquidity, staked } = mirSupply

  const list = [
    {
      label: "Liquidity",
      value: liquidity,
      tooltip: Tooltips.Dashboard.MIRCirculatingSupply.Liquidity,
    },
    {
      label: "Staked",
      value: staked,
      tooltip: Tooltips.Dashboard.MIRCirculatingSupply.Staked,
    },
    {
      label: "Others",
      value: minus(circulating, plus(liquidity, staked)),
      tooltip: Tooltips.Dashboard.MIRCirculatingSupply.Others,
    },
  ]

  return (
    <Card title="MIR Circulating Supply" lg>
      <Formatted symbol="MIR" big>
        {circulating}
      </Formatted>

      <DoughnutChart
        list={list}
        format={(value) => formatAsset(String(value), "MIR", { integer: true })}
      />
    </Card>
  )
}

export default MIRSupply
