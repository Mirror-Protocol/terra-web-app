import Card from "../../components/Card"
import Formatted from "../../components/Formatted"

const TVLTotal = ({ total, liquidity, collateral, stakedMir }: TVL) => {
  return (
    <div className="mobile">
      <Card title="Total Value Locked" lg>
        <Formatted symbol="uusd" config={{ integer: true }} big>
          {total}
        </Formatted>
      </Card>
    </div>
  )
}

export default TVLTotal
