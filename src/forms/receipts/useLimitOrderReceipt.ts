import { div } from "../../libs/math"
import { format, formatAsset, lookupSymbol } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { Type } from "../../pages/Trade"
import { findValue, splitTokenText } from "./receiptHelpers"

export default (type: Type, simulatedPrice?: string) => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)

  const order_id = val("order_id")
  const offer = splitTokenText(val("offer_asset"))
  const rtn = splitTokenText(val("ask_asset"))

  const offerSymbol = getSymbol(offer.token)
  const rtnSymbol = getSymbol(rtn.token)

  const price = {
    [Type.BUY]: div(offer.amount, rtn.amount),
    [Type.SELL]: div(rtn.amount, offer.amount),
  }[type]

  /* contents */
  const orderIdContents = {
    title: "Order ID",
    content: order_id,
  }

  const priceContents = {
    [Type.BUY]: {
      title: `Limit price per ${lookupSymbol(rtnSymbol)}`,
      content: `${format(price)} ${lookupSymbol(offerSymbol)}`,
    },
    [Type.SELL]: {
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
