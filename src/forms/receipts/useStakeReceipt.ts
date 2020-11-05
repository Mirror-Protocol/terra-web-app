import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { findValue } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)

  const amount = val("amount")
  const token = val("asset_token")
  const symbol = getSymbol(token)

  /* contents */
  return [{ title: "Amount", content: formatAsset(amount, symbol) }]
}
