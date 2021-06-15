import { minus, plus } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import DoughnutChart from "../../containers/DoughnutChart"

const MIRSupply = ({ circulating, liquidity, staked }: MIRSupply) => {
  const list = [
    { label: "Liquidity", value: liquidity },
    { label: "Staked", value: staked },
    { label: "Others", value: minus(circulating, plus(liquidity, staked)) },
  ]

  return (
    <div className="desktop">
      <Card title="MIR Circulating Supply" lg>
        <Formatted symbol="MIR" big>
          {circulating}
        </Formatted>

        <DoughnutChart
          list={list}
          format={(value) =>
            formatAsset(String(value), "MIR", { integer: true })
          }
        />
      </Card>
    </div>
  )
}

export default MIRSupply
