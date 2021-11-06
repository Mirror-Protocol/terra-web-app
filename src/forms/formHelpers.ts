import { AccAddress } from "@terra-money/terra.js"
import MESSAGE from "lang/MESSAGE.json"
import { ceil, gt, gte, lte, min, times, minus, plus } from "libs/math"
import { getLength, omitEmpty } from "libs/utils"
import { lookup, format, toAmount, formatAsset, validateDp } from "libs/parse"
import { getSymbol, hasTaxToken } from "helpers/token"
import { Type } from "pages/Swap"

/* forms */
export const step = (decimals = 6) => {
  return (1 / Math.pow(10, decimals)).toFixed(decimals)
}

export const placeholder = (decimals?: number) => {
  return step(decimals).replace("1", "0")
}

export const renderBalance = (
  balance?: string,
  symbol?: string,
  affix?: string
) =>
  balance && symbol
    ? {
        title: [affix, "Balance"].filter(Boolean).join(" "),
        content: format(balance, symbol),
      }
    : undefined

/* validate */
interface NumberRange {
  min?: number
  max?: number
}

interface AmountRange {
  optional?: boolean
  symbol?: string
  min?: string
  max?: string
  refvalue?: string
  refsymbol?: string
  isFrom?: boolean
  taxCap?: string
  taxRate?: string
  feeValue?: string
  feeSymbol?: string
  maxFee?: string
  type?: string
  decimals?: number
}

export const validate = {
  required: (value: string) => (!value ? "Required" : ""),

  length: (value: string, { min, max }: NumberRange, label: string) =>
    min && getLength(value) < min
      ? `${label} must be longer than ${min} bytes.`
      : max && getLength(value) > max
      ? `${label} must be shorter than ${max} bytes.`
      : "",

  address: (value: string) =>
    !value ? "Required" : !AccAddress.validate(value) ? "Invalid address" : "",

  url: (value: string) => {
    try {
      const { hostname } = new URL(value)
      return hostname.includes(".") ? "" : "Invalid URL"
    } catch (error) {
      const protocol = ["https://", "http://"]
      return !protocol.some((p) => value.startsWith(p))
        ? `URL must start with ${protocol.join(" or ")}`
        : "Invalid URL"
    }
  },

  amount: (value: string, range: AmountRange = {}, label = "Amount") => {
    const {
      optional,
      symbol,
      min,
      max,
      refvalue,
      refsymbol,
      isFrom,
      taxCap,
      taxRate,
      feeValue,
      feeSymbol,
      maxFee,
      type,
      decimals,
    } = range
    const amount = symbol ? toAmount(value, symbol) : value
    let tax = "0"

    if (symbol && taxRate && taxCap && hasTaxToken(getSymbol(symbol))) {
      tax = calcTax(amount, taxCap, taxRate)
    }

    if (
      maxFee === "" ||
      maxFee === undefined ||
      feeValue === undefined ||
      gt(feeValue, maxFee)
    ) {
      return `You don't have enough balance to pay for ${formatAsset(
        feeValue,
        feeSymbol
      )} fee.`
    }

    if (type === Type.PROVIDE) {
      if (max && gt(max, 0) && !(gte(amount, 0) && lte(amount, max))) {
        return `${label} must be between 0 and ${lookup(max, symbol)}`
      }
    }

    return (optional && !value) || symbol === "" || symbol === undefined
      ? ""
      : !(value || value === "")
      ? "Required"
      : isFrom && !gt(amount, 0)
      ? `${label} must be greater than 0`
      : min && !gte(amount, min)
      ? `${label} must be greater than ${min}`
      : !validateDp(value, decimals)
      ? `${label} must be within ${decimals} decimal points`
      : (type === Type.SWAP &&
          isFrom === true &&
          (max === "" || max === "0")) ||
        ((type === Type.PROVIDE || type === Type.WITHDRAW) &&
          (max === "" || max === "0"))
      ? MESSAGE.Form.Validate.InsufficientBalance
      : isFrom === true &&
        max &&
        gt(max, 0) &&
        !(gt(amount, 0) && lte(amount, max))
      ? `${label} must be between 0 and ${lookup(max, symbol)}`
      : isFrom === true &&
        max &&
        symbol === feeSymbol &&
        gt(plus(amount, feeValue), max)
      ? `Balance is insufficient due to the fee(${lookup(feeValue, feeSymbol)})`
      : ((type !== Type.PROVIDE && isFrom === true) || type === Type.PROVIDE) &&
        ((symbol !== feeSymbol && gt(minus(tax, minus(max, amount)), 0)) ||
          (symbol === feeSymbol &&
            gt(minus(tax, minus(max, plus(amount, feeValue))), 0)))
      ? `You must leave at least ${format(tax, symbol)} ${symbol} tax value`
      : refvalue === "0" && refsymbol !== ""
      ? "Not enough pool balance"
      : ""
  },

  symbol: (symbol: string) => {
    const regex = RegExp(/[a-zA-Z+-]/)
    return Array.from(symbol).some((char) => !regex.test(char)) ? "Invalid" : ""
  },

  isTrue: (src: boolean | string) => {
    return src && src !== "false" ? "calculating..." : ""
  },
}

export const calcTax = (amount: string, taxCap: string, taxRate: string) => {
  return ceil(min([times(amount, taxRate), taxCap]))
}

/* data (utf-8) */
export const toBase64 = (object: object) => {
  try {
    return Buffer.from(JSON.stringify(omitEmpty(object))).toString("base64")
  } catch (error) {
    return ""
  }
}

export const fromBase64 = <T>(string: string): T => {
  try {
    return JSON.parse(Buffer.from(string, "base64").toString())
  } catch (error) {
    return {} as T
  }
}
