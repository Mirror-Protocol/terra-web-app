import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useProtocol } from "../../data/contract/protocol"
import { PoolType } from "../../types/Types"
import { findValueFromLogs, findPathFromContract } from "./receiptHelpers"
import { parseTokenText } from "./receiptHelpers"

export default (type: PoolType) => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogs(logs)
  const fc = findPathFromContract(logs)

  const join = (array: { amount: string; token: string }[]) =>
    array
      .map(({ amount, token }) => formatAsset(amount, getSymbol(token)))
      .join(" + ")

  const token = val("contract_address")
  const symbol = getSymbol(token)
  const deposit = parseTokenText(val("assets", 1))
  const received = val("share", 1)
  const refund = parseTokenText(val("refund_assets"))
  const withdrawn = val("withdrawn_share")
  const withdrawnToken = fc("transfer")("contract_address")
  const withdrawnSymbol = getSymbol(withdrawnToken)

  /* contents */
  return {
    [PoolType.PROVIDE]: [
      {
        title: "Received",
        content: formatAsset(received, getLpName(symbol)),
      },
      {
        title: "Deposited",
        content: join(deposit),
      },
    ],
    [PoolType.WITHDRAW]: [
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
