import { formatAsset } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import { Type } from "../../pages/Pool"
import getLpName from "../../pages/Stake/getLpName"
import usePoolShare from "../usePoolShare"
import { findValue, parseTokenText } from "./receiptHelpers"

export default (type: Type) => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const getPoolShare = usePoolShare()
  const val = findValue(logs)

  const join = (array: { amount: string; token: string }[]) =>
    array
      .map(({ amount, token }) => formatAsset(amount, getSymbol(token)))
      .join(" + ")

  const symbol = getSymbol(val("contract_address"))
  const deposit = parseTokenText(val("assets", 1))
  const received = val("share", 1)
  const poolShare = getPoolShare({ amount: received, symbol })
  const refund = parseTokenText(val("refund_assets"))
  const withdrawn = val("withdrawn_share")

  /* contents */
  return {
    [Type.PROVIDE]: [
      {
        title: "Received",
        content: formatAsset(received, getLpName(symbol)),
        children: [{ title: "Pool share from Tx", content: poolShare.text }],
      },
      {
        title: "Deposited",
        content: join(deposit),
      },
    ],
    [Type.WITHDRAW]: [
      {
        title: "Refund",
        content: join(refund),
      },
      {
        title: "Withdrawn",
        content: formatAsset(withdrawn, getLpName(symbol)),
      },
    ],
  }[type]
}
