import Count from "../components/Count"
import { useUusdBalance } from "../data/native/balance"

const Balance = () => {
  const uusd = useUusdBalance()

  return <Count symbol="uusd">{uusd}</Count>
}

export default Balance
