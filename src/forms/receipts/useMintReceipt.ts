import { useRecoilValue } from "recoil"
import { div, times } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { useProtocol } from "../../data/contract/protocol"
import { MintType } from "../../types/Types"
import { useFindPrice } from "../../data/contract/normalize"
import { getMintPriceKeyQuery } from "../../data/contract/collateral"
import { findPathFromContract, splitTokenText } from "./receiptHelpers"

export default (type: MintType) => (logs: TxLog[]) => {
  const borrow = type === MintType.BORROW
  const short = type === MintType.SHORT
  const open = borrow || short

  /* context */
  const { getSymbol } = useProtocol()
  const find = useFindPrice()
  const getPriceKey = useRecoilValue(getMintPriceKeyQuery)

  const fc = findPathFromContract(logs)

  const mint = splitTokenText(
    fc("open_position")("mint_amount") || fc("mint")("mint_amount")
  )

  const collateral = splitTokenText(fc("open_position")("collateral_amount"))
  const deposit = splitTokenText(fc("deposit")("deposit_amount"))
  const withdraw = splitTokenText(fc("withdraw")("withdraw_amount"))
  const burn = splitTokenText(fc("burn")("burn_amount"))
  const tax = splitTokenText(fc("withdraw")("tax_amount"))
  const protocolFee = splitTokenText(fc("burn")("protocol_fee"))

  const getRatio = () => {
    if (open) {
      const nextCollateral = {
        amount: collateral.amount,
        token: collateral.token,
      }

      const nextAsset = {
        amount: mint.amount,
        token: mint.token,
      }

      const collateralValue = times(
        nextCollateral.amount,
        find(getPriceKey(nextCollateral.token), nextCollateral.token)
      )

      const mintedValue = times(
        nextAsset.amount,
        find(getPriceKey(nextAsset.token), nextAsset.token)
      )

      return div(collateralValue, mintedValue)
    }
  }

  /* contents */
  const renderAsset = ({ amount, token }: { amount: string; token: string }) =>
    formatAsset(amount, getSymbol(token))

  return [
    { title: "Collateral Ratio", content: percent(getRatio()) },
    { title: "Borrowed Assets", content: renderAsset(mint) },
    { title: "Collateral", content: renderAsset(collateral) },
    { title: "Burned Asset", content: renderAsset(burn) },
    { title: "Withdrawn Collateral", content: renderAsset(withdraw) },
    { title: "Deposited Collateral", content: renderAsset(deposit) },
    { title: "Tax", content: renderAsset(tax) },
    { title: "Protocol Fee", content: renderAsset(protocolFee) },
  ]
}
