import { plus } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { findValue, splitTokenText } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()

  const reduced = logs.reduce<Dictionary<string>>((acc, cur, index) => {
    const value = findValue(logs)
    const refund = value("refund_collateral_amount", index)
    const { amount, token } = splitTokenText(refund)
    const prevValue = acc[token] ?? 0

    return { ...acc, [token]: plus(prevValue, amount) }
  }, {})

  return [
    {
      title: "Refund",
      content: Object.entries(reduced)
        .map(([token, value]) => formatAsset(value, getSymbol(token)))
        .join(" + "),
    },
  ]
}
