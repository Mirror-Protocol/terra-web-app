import { useRecoilValue } from "recoil"
import { div, minus, plus, times } from "../../libs/math"
import { formatAsset, lookupSymbol } from "../../libs/parse"
import { percent } from "../../libs/num"
import { useProtocol } from "../../data/contract/protocol"
import { MintType } from "../../types/Types"
import { useFindPrice } from "../../data/contract/normalize"
import { getMintPriceKeyQuery } from "../../data/contract/collateral"
import { findValueFromLogs, splitTokenText } from "./receiptHelpers"

export default (type: MintType, prev?: MintPosition) => (logs: TxLog[]) => {
  const borrow = type === MintType.BORROW
  const short = type === MintType.SHORT
  const edit = type === MintType.EDIT
  const close = type === MintType.CLOSE
  const open = borrow || short

  /* context */
  const { getSymbol, parseToken } = useProtocol()
  const find = useFindPrice()
  const getPriceKey = useRecoilValue(getMintPriceKeyQuery)

  const val = findValueFromLogs(logs)

  /* prev position */
  const prevCollateral = prev && parseToken(prev.collateral)
  const prevAsset = prev && parseToken(prev.asset)

  const collateral = splitTokenText(val("collateral_amount"))
  const deposit = splitTokenText(val("deposit_amount", Number(edit)))
  const withdraw = splitTokenText(val("withdraw_amount", Number(edit || close)))

  const mint = splitTokenText(val("mint_amount"))
  const burn = splitTokenText(val("burn_amount"))
  const protocolFee = splitTokenText(val("protocol_fee"))

  const nextCollateral = {
    [MintType.BORROW]: {
      amount: collateral.amount,
      token: collateral.token,
    },
    [MintType.SHORT]: {
      amount: collateral.amount,
      token: collateral.token,
    },
    [MintType.CLOSE]: {
      amount: minus(prevCollateral?.amount, protocolFee.amount),
      token: prevCollateral?.token,
    },
    [MintType.EDIT]: {
      amount: deposit.amount
        ? plus(prevCollateral?.amount, deposit.amount)
        : withdraw.amount
        ? minus(
            minus(prevCollateral?.amount, withdraw.amount),
            protocolFee.amount
          )
        : prevCollateral?.amount,
      token: prevCollateral?.token,
    },
  }[type]

  const nextAsset = edit
    ? {
        amount: mint.amount
          ? plus(prevAsset?.amount, mint.amount)
          : burn.amount
          ? minus(prevAsset?.amount, burn.amount)
          : prevAsset?.amount,
        token: prevAsset?.token,
      }
    : open
    ? { amount: mint.amount, token: mint.token }
    : { amount: prevAsset?.amount, token: prevAsset?.token }

  const collateralPrice =
    nextCollateral.token &&
    find(getPriceKey(nextCollateral.token), nextCollateral.token)
  const collateralValue = times(nextCollateral.amount, collateralPrice)

  const mintedPrice =
    nextAsset.token && find(getPriceKey(nextAsset.token), nextAsset.token)
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
          title: "Borrowed Assets",
          content: formatAsset(nextAsset.amount, getSymbol(nextAsset.token)),
        },
        {
          title: "Collateral",
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
        {
          title: "Protocol Fee",
          content: formatAsset(
            protocolFee.amount,
            lookupSymbol(getSymbol(protocolFee.token))
          ),
        },
      ]
}
