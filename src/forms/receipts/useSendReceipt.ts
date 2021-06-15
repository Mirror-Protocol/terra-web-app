import { formatAsset } from "../../libs/parse"
import { useNetwork } from "../../hooks"
import { useProtocol } from "../../data/contract/protocol"
import {
  findValueFromLogs,
  splitTokenText,
  parseEvents,
} from "./receiptHelpers"

export default () =>
  (logs: TxLog[], { Tx }: TxInfo) => {
    const { shuttle } = useNetwork()
    const { getSymbol } = useProtocol()
    const val = findValueFromLogs(logs)
    const { transfer } = parseEvents(logs[0]["Events"])
    const uusd = splitTokenText(transfer?.amount)

    const address = val("to")
    const amount = uusd.amount ?? val("amount")
    const token = uusd.token ?? val("contract_address")
    const symbol = getSymbol(token)

    const recipient = transfer?.recipient ?? address
    const $memo = Tx.Memo
    const to = Object.values(shuttle).includes(recipient) ? $memo : recipient
    const memo = Object.values(shuttle).includes(recipient) ? "" : $memo

    /* contents */
    return [
      { title: "Sent to", content: to },
      { title: "Amount", content: formatAsset(amount, symbol) },
      { title: "Memo", content: memo },
    ]
  }
