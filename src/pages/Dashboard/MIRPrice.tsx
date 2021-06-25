import { isNil } from "ramda"
import Tooltips from "../../lang/Tooltips"
import { PriceKey } from "../../hooks/contractKeys"
import { useProtocol } from "../../data/contract/protocol"
import { useFindChange } from "../../data/stats/assets"
import { useDashboard } from "../../data/stats/statistic"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"

const MIRPrice = () => {
  const { getToken } = useProtocol()
  const { mirPrice: price } = useDashboard()
  const token = getToken("MIR")

  const findChange = useFindChange()
  const change = findChange(PriceKey.PAIR, token)

  const title = (
    <TooltipIcon content={Tooltips.Dashboard.MIRPrice}>MIR Price</TooltipIcon>
  )

  return (
    <Card title={title} lg>
      <Formatted unit="UST" big>
        {price}
      </Formatted>

      <footer>
        <Change idle={isNil(change)}>{change}</Change>
      </footer>
    </Card>
  )
}

export default MIRPrice
