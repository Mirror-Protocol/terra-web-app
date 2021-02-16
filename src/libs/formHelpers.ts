import { AccAddress } from "@terra-money/terra.js"
import { div, gt, gte, isInteger, pow } from "./math"
import { getLength, omitEmpty } from "./utils"
import { dp, validateDp, lookup, format, toAmount } from "./parse"

/* forms */
export const placeholder = (symbol?: string) => step(symbol).replace("1", "0")
export const step = (symbol?: string) => div(1, pow(10, dp(symbol)))

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
}

export const validate = {
  required: (value: string) => (!value ? "Required" : ""),

  length: (value: string, { min, max }: NumberRange, label: string) =>
    min && getLength(value) < min
      ? `${label} must be longer than ${min} bytes.`
      : max && getLength(value) > max
      ? `${label} must be shorter than ${max} bytes.`
      : "",

  address: (value: string, isAddress = [AccAddress.validate]) =>
    !value
      ? "Required"
      : !isAddress.some((validate) => validate(value))
      ? "Invalid address"
      : "",

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

  integer: (value: string, label: string) =>
    !isInteger(value) ? `${label} must be an integer` : "",

  amount: (value: string, range: AmountRange = {}, label = "Amount") => {
    const { optional, symbol, min, max } = range
    const amount = symbol ? toAmount(value) : value

    return optional && !value
      ? ""
      : !value
      ? "Required"
      : !min && !gt(value, 0)
      ? `${label} must be greater than 0`
      : min && !gte(amount, min)
      ? `${label} must be greater than ${lookup(min, symbol)}`
      : !validateDp(value, symbol)
      ? `${label} must be within ${dp(symbol)} decimal points`
      : max && gt(max, 0) && gt(amount, max)
      ? `${label} must be between 0 and ${lookup(max, symbol)}`
      : symbol && max && !gt(max, 0)
      ? "Insufficient balance"
      : ""
  },

  symbol: (symbol: string) => {
    const regex = RegExp(/[a-zA-Z+-]/)
    return Array.from(symbol).some((char) => !regex.test(char)) ? "Invalid" : ""
  },
}

export const validateSlippage = (value: string) =>
  !validateDp(value) ? `Slippage must be within ${dp()} decimal points` : ""

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
