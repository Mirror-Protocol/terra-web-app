import { formatAsset } from "../../libs/parse"
import { useContractsAddress, useNetwork } from "../../hooks"
import { findValue, splitTokenText, parseEvents } from "./receiptHelpers"

export default () => (logs: TxLog[], { Tx }: TxInfo) => {
  const { shuttle } = useNetwork()
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)
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
