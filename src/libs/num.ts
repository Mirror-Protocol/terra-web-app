import { isFinite, times } from "./math"
import { decimal, toFixed } from "./parse"

export const percentage = (value?: string, dp = 2, fixed?: number): string =>
  isFinite(value)
    ? fixed
      ? toFixed(times(value, 100), dp)
      : decimal(times(value, 100), dp)
    : ""

export const percent = (value?: string, dp = 2, fixed?: number): string =>
  isFinite(value) ? percentage(value, dp, fixed) + "%" : ""
