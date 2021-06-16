import { isNil } from "ramda"
import { useProtocol } from "../../data/contract/protocol"
import { PriceKey } from "../../hooks/contractKeys"
import { useFindChange } from "../../data/stats/assets"
import { useDashboard } from "../../data/stats/statistic"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"

const MIRPrice = () => {
  const { getToken } = useProtocol()
  const { mirPrice: price } = useDashboard()
  const token = getToken("MIR")

  const findChange = useFindChange()
  const change = findChange(PriceKey.PAIR, token)

  return (
    <Card title="MIR Price" lg>
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
