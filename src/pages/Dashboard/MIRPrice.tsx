import { useProtocol } from "../../data/contract/protocol"
import { PriceKey } from "../../hooks/contractKeys"
import { useMIRPrice } from "../../data/contract/normalize"
import { useFindChange } from "../../data/stats/assets"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"

const MIRPrice = () => {
  const { getToken } = useProtocol()
  const token = getToken("MIR")

  const findChange = useFindChange()
  const price = useMIRPrice()
  const change = findChange?.(PriceKey.PAIR, token)

  return (
    <Card title="MIR Price" lg>
      <Formatted unit="UST" big>
        {price}
      </Formatted>

      <footer>
        <Change>{change}</Change>
      </footer>
    </Card>
  )
}

export default MIRPrice
