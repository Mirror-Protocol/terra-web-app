import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { findValue, splitTokenText } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)

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
