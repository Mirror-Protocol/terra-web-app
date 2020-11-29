import { UUSD } from "../constants"
import { useContract } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import Count from "../components/Count"
import WithResult from "../containers/WithResult"

const Balance = () => {
  const { uusd } = useContract()
  const renderError = () => <p className="red">Error</p>

  return (
    <WithResult
      keys={[AccountInfoKey.UUSD]}
      renderError={renderError}
      size={21}
    >
      <Count symbol={UUSD}>{uusd}</Count>
    </WithResult>
  )
}

export default Balance
