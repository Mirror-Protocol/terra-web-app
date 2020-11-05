import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { findValue, splitTokenText, parseEvents } from "./receiptHelpers"

export default () => (logs: TxLog[], { Tx }: TxInfo) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)
  const { transfer } = parseEvents(logs[0]["Events"])
  const uusd = splitTokenText(transfer?.amount)

  const address = val("to")
  const amount = uusd.amount ?? val("amount")
  const token = uusd.token ?? val("contract_address")
  const symbol = getSymbol(token)

  /* contents */
  return [
    { title: "Sent to", content: transfer?.recipient ?? address },
    { title: "Amount", content: formatAsset(amount, symbol) },
    { title: "Memo", content: Tx.Memo },
  ]
}
