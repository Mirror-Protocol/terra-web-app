import { div, minus, plus, times } from "../../libs/math"
import { formatAsset, lookupSymbol } from "../../libs/parse"
import { percent } from "../../libs/num"
import { useContract, useContractsAddress, useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { Type } from "../../pages/Mint"
import { findValue, splitTokenText } from "./receiptHelpers"

export default (type: Type, prev?: MintPosition) => (logs: TxLog[]) => {
  const open = type === Type.OPEN
  const close = type === Type.CLOSE
  const priceKey = PriceKey.ORACLE
  useRefetch([priceKey])

  /* context */
  const { getSymbol, parseToken } = useContractsAddress()
  const { find } = useContract()
  const val = findValue(logs)

  /* prev position */
  const prevCollateral = prev && parseToken(prev.collateral)
  const prevAsset = prev && parseToken(prev.asset)

  const collateral = splitTokenText(val("collateral_amount"))
  const deposit = splitTokenText(val("deposit_amount"))
  const withdraw = splitTokenText(val("withdraw_amount", Number(close)))
  const mint = splitTokenText(val("mint_amount"))
  const burn = splitTokenText(val("burn_amount"))

  const nextCollateral = {
    [Type.OPEN]: {
      amount: collateral.amount,
      symbol: getSymbol(collateral.token),
    },
    [Type.DEPOSIT]: {
      amount: plus(prevCollateral?.amount, deposit.amount),
      symbol: prevCollateral?.symbol,
    },
    [Type.WITHDRAW]: {
      amount: minus(prevCollateral?.amount, withdraw.amount),
      symbol: prevCollateral?.symbol,
    },
    [Type.CLOSE]: {
      amount: prevCollateral?.amount,
      symbol: prevCollateral?.symbol,
    },
  }[type]

  const nextAsset = open
    ? { amount: mint.amount, symbol: getSymbol(mint.token) }
    : { amount: prevAsset?.amount, symbol: prevAsset?.symbol }

  const collateralPrice = find(priceKey, nextCollateral.symbol!)
  const collateralValue = times(nextCollateral.amount, collateralPrice)
  const mintedPrice = find(priceKey, nextAsset.symbol!)
  const mintedValue = times(nextAsset.amount, mintedPrice)
  const ratio = div(collateralValue, mintedValue)

  /* contents */
  return !close
    ? [
        {
          title: "Collateral Ratio",
          content: percent(ratio),
        },
        {
          title: "Minted Assets",
          content: formatAsset(nextAsset.amount, nextAsset.symbol),
        },
        {
          title: "Collaterals",
          content: formatAsset(nextCollateral.amount, nextCollateral.symbol),
        },
      ]
    : [
        {
          title: "Burned Asset",
          content: formatAsset(
            burn.amount,
            lookupSymbol(getSymbol(burn.token))
          ),
        },
        {
          title: "Withdrawn Collateral",
          content: formatAsset(
            withdraw.amount,
            lookupSymbol(getSymbol(withdraw.token))
          ),
        },
      ]
}
