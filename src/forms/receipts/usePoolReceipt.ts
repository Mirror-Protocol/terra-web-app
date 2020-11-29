import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useContractsAddress } from "../../hooks"
import { Type } from "../../pages/Pool"
import usePoolShare from "../usePoolShare"
import { findValue, fromContract, parseTokenText } from "./receiptHelpers"

export default (type: Type) => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const getPoolShare = usePoolShare()
  const val = findValue(logs)
  const fc = fromContract(logs)

  const join = (array: { amount: string; token: string }[]) =>
    array
      .map(({ amount, token }) => formatAsset(amount, getSymbol(token)))
      .join(" + ")

  const token = val("contract_address")
  const symbol = getSymbol(token)
  const deposit = parseTokenText(val("assets", 1))
  const received = val("share", 1)
  const poolShare = getPoolShare({ amount: received, token })
  const refund = parseTokenText(val("refund_assets"))
  const withdrawn = val("withdrawn_share")
  const withdrawnToken = fc[0]?.["transfer"]?.["contract_address"]
  const withdrawnSymbol = getSymbol(withdrawnToken)

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
        content: formatAsset(withdrawn, getLpName(withdrawnSymbol)),
      },
    ],
  }[type]
}
