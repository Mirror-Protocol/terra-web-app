import { capitalize } from "../../libs/utils"
import { formatAsset } from "../../libs/parse"
import { useProtocol } from "../../data/contract/protocol"
import { findValueFromLogs } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogs(logs)

  const id = val("poll_id")
  const amount = val("amount")
  const token = val("contract_address")
  const answer = val("vote_option")
  const symbol = getSymbol(token)

  return [
    { title: "Poll ID", content: id },
    { title: "Deposit", content: formatAsset(amount, symbol) },
    { title: "Answer", content: answer && capitalize(answer) },
  ]
}
