import { formatAsset } from "../../libs/parse"
import { findValueFromLogs, splitTokenText } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const val = findValueFromLogs(logs)
  const unlocked = val("unlocked_amount")
  const { amount } = splitTokenText(unlocked)

  return [{ title: "Unlocked", content: formatAsset(amount, "uusd") }]
}
