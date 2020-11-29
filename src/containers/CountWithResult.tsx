import { DataKey } from "../hooks/useContract"
import WithResult from "./WithResult"
import Count from "../components/Count"

interface Props extends CountOptions {
  keys?: DataKey[]
  results?: Result[]
}

const CountWithResult = ({ keys, results, ...options }: Props) => (
  <WithResult keys={keys} results={results} dataOnly>
    <Count {...options} />
  </WithResult>
)

export default CountWithResult
