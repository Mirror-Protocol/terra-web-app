import BigNumber from "bignumber.js"
import numeral from "numeral"
import { SMALLEST } from "../constants"

BigNumber.config({ EXPONENTIAL_AT: [-18, 20] })

type Formatter<T = string> = (
  amount?: string,
  symbol?: string,
  config?: FormatConfig
) => T

const rm = BigNumber.ROUND_DOWN

export const dp = (symbol?: string) =>
  !symbol || lookupSymbol(symbol) === "UST" ? 2 : 6

export const validateDp = (value: string, symbol?: string, decimal?: number) =>
  new BigNumber(value)
    .times(new BigNumber(10).pow(decimal ?? dp(symbol)))
    .isInteger()

export const decimal = (value = "0", dp = 6) =>
  new BigNumber(value).decimalPlaces(dp, rm).toString()

export const lookup: Formatter = (amount = "0", symbol, config) => {
  const value = symbol
    ? new BigNumber(amount).div(SMALLEST).dp(6, rm)
    : new BigNumber(amount)

  return value
    .dp(
      config?.dp ??
        (config?.integer ? 0 : value.gte(SMALLEST) ? 2 : dp(symbol)),
      rm
    )
    .toString()
}

export const lookupSymbol = (symbol?: string) =>
  symbol === "uluna"
    ? "Luna"
    : symbol?.startsWith("u")
    ? symbol.slice(1, 3).toUpperCase() + "T"
    : symbol ?? ""

export const getIsBig: Formatter<boolean> = (amount, symbol) =>
  new BigNumber(lookup(amount, symbol)).gte(1e6)

export const format: Formatter = (amount, symbol, config) => {
  const value = new BigNumber(lookup(amount, symbol, config))
  const formatted = getIsBig(amount, symbol)
    ? numeral(value.div(1e4).integerValue(rm).times(1e4)).format("0,0.[00]a")
    : numeral(value).format(config?.integer ? "0,0" : "0,0.[000000]")

  return formatted.toUpperCase()
}

export const formatAsset: Formatter = (amount, symbol, config) =>
  symbol ? `${format(amount, symbol, config)} ${lookupSymbol(symbol)}` : ""

export const toAmount = (value: string) =>
  value ? new BigNumber(value).times(SMALLEST).integerValue().toString() : "0"

export const getIsTokenNative = (token: string) => token.startsWith("u")
