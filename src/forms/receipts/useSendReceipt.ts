import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { findValue } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)

  const address = val("to")
  const amount = val("amount")
  const token = val("contract_address")
  const symbol = getSymbol(token)

  /* contents */
  return [
    { title: "Sent to", content: address },
    { title: "Amount", content: formatAsset(amount, symbol) },
  ]
}
