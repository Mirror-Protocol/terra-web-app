import Formatted from "../components/Formatted"
import { useUusdBalance } from "../data/native/balance"

const Balance = () => {
  const uusd = useUusdBalance()

  return <Formatted symbol="uusd">{uusd}</Formatted>
}

export default Balance
