import { MIR } from "../../constants"
import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useContractsAddress } from "../../hooks"
import { findValue } from "./receiptHelpers"

export default (gov: boolean) => (logs: TxLog[]) => {
  const { getSymbol } = useContractsAddress()
  const val = findValue(logs)

  const amount = val("amount")
  const token = val("asset_token") || val("contract_address")
  const symbol = getSymbol(token)

  /* contents */
  return [
    {
      title: "Amount",
      content: formatAsset(amount, !gov ? getLpName(symbol) : MIR),
    },
  ]
}
