import { div } from "../../libs/math"
import { format, formatAsset, lookupSymbol } from "../../libs/parse"
import { useProtocol } from "../../data/contract/protocol"
import { TradeType } from "../../types/Types"
import { findValueFromLogs, splitTokenText } from "./receiptHelpers"

export default (type: TradeType, simulatedPrice?: string) => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogs(logs)

  const order_id = val("order_id")
  const offer = splitTokenText(val("offer_asset"))
  const rtn = splitTokenText(val("ask_asset"))

  const offerSymbol = getSymbol(offer.token)
  const rtnSymbol = getSymbol(rtn.token)

  const price = {
    [TradeType.BUY]: div(offer.amount, rtn.amount),
    [TradeType.SELL]: div(rtn.amount, offer.amount),
  }[type]

  /* contents */
  const orderIdContents = {
    title: "Order ID",
    content: order_id,
  }

  const priceContents = {
    [TradeType.BUY]: {
      title: `Limit price per ${lookupSymbol(rtnSymbol)}`,
      content: `${format(price)} ${lookupSymbol(offerSymbol)}`,
    },
    [TradeType.SELL]: {
      title: `Limit price per ${lookupSymbol(offerSymbol)}`,
      content: `${format(price)} ${lookupSymbol(rtnSymbol)}`,
    },
  }[type]

  const lockedContents = {
    title: "Locked",
    content: formatAsset(offer.amount, offerSymbol),
    children: [
      { title: "Order Value", content: formatAsset(rtn.amount, rtnSymbol) },
    ],
  }

  return [orderIdContents, priceContents, lockedContents]
}
