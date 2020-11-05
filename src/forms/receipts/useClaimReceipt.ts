import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { fromContract } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const [fc] = fromContract(logs)
  const amount = fc?.withdraw?.amount
  const token = fc?.transfer?.contract_address

  return [{ title: "Claimed", content: formatAsset(amount, getSymbol(token)) }]
}
