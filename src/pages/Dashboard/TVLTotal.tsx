import { useDashboard } from "../../data/stats/statistic"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"

const TVLTotal = () => {
  const { totalValueLocked } = useDashboard()

  return (
    <Card title="Total Value Locked" lg>
      <Formatted symbol="uusd" config={{ integer: true }} big>
        {totalValueLocked.total}
      </Formatted>
    </Card>
  )
}

export default TVLTotal
