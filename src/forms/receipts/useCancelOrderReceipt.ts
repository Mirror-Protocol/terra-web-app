import { formatAsset } from "../../libs/parse"
import { useProtocol } from "../../data/contract/protocol"
import { findValueFromLogs, splitTokenText } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogs(logs)

  const order_id = val("order_id")
  const refund = splitTokenText(val("bidder_refund"))
  const symbol = getSymbol(refund.token)

  /* contents */
  const orderIdContents = {
    title: "Order ID",
    content: order_id,
  }

  const refundContents = {
    title: "Returned Asset",
    content: formatAsset(refund.amount, symbol),
  }

  return [orderIdContents, refundContents]
}
