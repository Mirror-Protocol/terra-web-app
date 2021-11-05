import BigNumber from "bignumber.js"
import numeral from "numeral"
import { UST, UUSD } from "constants/constants"
import { tokenInfos } from "rest/usePairs"

type Formatter = (
  amount?: string,
  symbol?: string,
  config?: FormatConfig
) => string

const rm = BigNumber.ROUND_DOWN
export const dp = (contract_addr?: string) => {
  if (!contract_addr) {
    return 6
  }

  const tokenInfo = tokenInfos.get(contract_addr)
  return tokenInfo ? tokenInfo.decimals : 6
}
export const validateDp = (value: string, contract_addr?: string) =>
  new BigNumber(value)
    .times(new BigNumber(10).pow(dp(contract_addr)))
    .isInteger()

export const decimal = (value = "0", dp = 6) =>
  new BigNumber(value).decimalPlaces(dp, rm).toString()

export const lookup: Formatter = (amount = "0", contract_addr, config) => {
  let decimals = 6
  if (contract_addr) {
    const tokenInfo = tokenInfos.get(contract_addr)
    if (tokenInfo) {
      decimals = tokenInfo.decimals
    }
  }

  const e = Math.pow(10, decimals)

  const value = contract_addr
    ? new BigNumber(amount).div(e).dp(decimals, rm)
    : new BigNumber(amount)

  return value
    .dp(
      config?.dp ??
        (config?.integer ? 0 : value.gte(e) ? 2 : dp(contract_addr)),
      rm
    )
    .toString()
}

export const lookupSymbol = (symbol?: string) =>
  symbol === UUSD ? UST : symbol

export const format: Formatter = (amount, contract_addr, config) => {
  const value = new BigNumber(lookup(amount, contract_addr, config))
  return value.gte(1e6)
    ? numeral(value.div(1e4).integerValue(rm).times(1e4)).format("0,0.[00]a")
    : numeral(value).format(config?.integer ? "0,0" : "0,0.[000000]")
}

export const formatAsset: Formatter = (amount, symbol, config) =>
  symbol ? `${format(amount, symbol, config)} ${lookupSymbol(symbol)}` : ""

export const toAmount = (value: string, contract_addr?: string) => {
  let decimals = 6
  if (contract_addr) {
    const tokenInfo = tokenInfos.get(contract_addr)
    if (tokenInfo) {
      decimals = tokenInfo.decimals
    }
  }

  const e = Math.pow(10, decimals)
  return value ? new BigNumber(value).times(e).integerValue().toString() : "0"
}
