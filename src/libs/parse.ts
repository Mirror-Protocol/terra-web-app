import BigNumber from "bignumber.js"
import numeral from "numeral"
import { UST, UUSD } from "../constants"

const rm = BigNumber.ROUND_DOWN
export const dp = (symbol?: string) => (!symbol || symbol === UUSD ? 2 : 6)
export const validateDp = (value: string, symbol?: string) =>
  new BigNumber(value).times(new BigNumber(10).pow(dp(symbol))).isInteger()

export const decimal = (value: string, dp: number = 6) =>
  new BigNumber(value).decimalPlaces(dp, rm).toString()

export const lookup = (
  amount: string = "0",
  symbol?: string,
  integer?: boolean
) => {
  const value = symbol
    ? new BigNumber(amount).div(1e6).dp(6, rm)
    : new BigNumber(amount)

  return value.dp(integer ? 0 : value.gte(1e6) ? 2 : dp(symbol), rm).toString()
}

export const lookupSymbol = (symbol?: string) =>
  symbol === UUSD ? UST : symbol

export const format = (amount?: string, symbol?: string, integer?: boolean) => {
  const value = new BigNumber(lookup(amount, symbol))
  return value.gte(1e6)
    ? numeral(value.div(1e4).integerValue(rm).times(1e4)).format("0,0.[00]a")
    : numeral(value).format(integer ? "0,0" : "0,0.[000000]")
}

export const formatAsset = (
  amount?: string,
  symbol?: string,
  integer?: boolean
) =>
  symbol ? `${format(amount, symbol, integer)} ${lookupSymbol(symbol)}` : ""

export const toAmount = (value: string) =>
  value ? new BigNumber(value).times(1e6).integerValue().toString() : "0"
