import { AccAddress } from "@terra-money/terra.js"
import MESSAGE from "../lang/MESSAGE.json"
import { UUSD } from "../constants"
import { gt, gte, lte } from "../libs/math"
import { getLength, omitEmpty } from "../libs/utils"
import { dp, validateDp, lookup, format, toAmount } from "../libs/parse"

/* forms */
export const placeholder = (symbol?: string) =>
  !symbol || symbol === UUSD ? "0.00" : "0.000000"

export const step = (symbol?: string) =>
  !symbol || symbol === UUSD ? "0.01" : "0.000001"

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
    const { optional, symbol, min, max } = range
    const amount = symbol ? toAmount(value) : value

    return optional && !value
      ? ""
      : !value
      ? "Required"
      : !gt(value, 0)
      ? `${label} must be greater than 0`
      : min && !gte(amount, min)
      ? `${label} must be greater than ${min}`
      : !validateDp(value, symbol)
      ? `${label} must be within ${dp(symbol)} decimal points`
      : max && gt(max, 0) && !(gt(amount, 0) && lte(amount, max))
      ? `${label} must be between 0 and ${lookup(max, symbol)}`
      : symbol && max && !gt(max, 0)
      ? MESSAGE.Form.Validate.InsufficientBalance
      : ""
  },

  symbol: (symbol: string) => {
    const regex = RegExp(/[a-zA-Z+-]/)
    return Array.from(symbol).some((char) => !regex.test(char)) ? "Invalid" : ""
  },
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
