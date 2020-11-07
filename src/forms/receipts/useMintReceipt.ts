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
      token: collateral.token,
    },
    [Type.DEPOSIT]: {
      amount: plus(prevCollateral?.amount, deposit.amount),
      token: prevCollateral?.token,
    },
    [Type.WITHDRAW]: {
      amount: minus(prevCollateral?.amount, withdraw.amount),
      token: prevCollateral?.token,
    },
    [Type.CLOSE]: {
      amount: prevCollateral?.amount,
      token: prevCollateral?.token,
    },
  }[type]

  const nextAsset = open
    ? { amount: mint.amount, token: mint.token }
    : { amount: prevAsset?.amount, token: prevAsset?.token }

  const collateralPrice = find(priceKey, nextCollateral.token!)
  const collateralValue = times(nextCollateral.amount, collateralPrice)
  const mintedPrice = find(priceKey, nextAsset.token!)
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
          content: formatAsset(nextAsset.amount, getSymbol(nextAsset.token)),
        },
        {
          title: "Collaterals",
          content: formatAsset(
            nextCollateral.amount,
            getSymbol(nextCollateral.token)
          ),
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
