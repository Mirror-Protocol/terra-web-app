import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useProtocol } from "../../data/contract/protocol"
import { StakeType } from "../../types/Types"
import { findValueFromLogs, parseTokenText } from "./receiptHelpers"

export default (type: StakeType, gov: boolean) => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogs(logs)

  const join = (array: { amount: string; token: string }[]) =>
    array
      .map(({ amount, token }) => formatAsset(amount, getSymbol(token)))
      .join(" + ")

  const amount = val("amount")
  const token = val("asset_token") || val("contract_address")
  const symbol = getSymbol(token)

  /* unstake */
  const refund = parseTokenText(val("refund_assets", 1))

  /* contents */
  const amountContent = {
    title: type === StakeType.UNSTAKE ? "Unstaked" : "Amount",
    content: formatAsset(amount, !gov ? getLpName(symbol) : "MIR"),
  }

  const refundContent = {
    title: "Refund",
    content: join(refund),
  }

  return type === StakeType.UNSTAKE && !gov
    ? [amountContent, refundContent]
    : [amountContent]
}
