import { isFinite, times } from "./math"
import { decimal, toFixed } from "./parse"

export const percentage = (value?: string, dp = 2): string =>
  isFinite(value)
    ? dp === -1
      ? decimal(times(value, 100))
      : toFixed(times(value, 100), dp)
    : ""

export const percent = (value?: string, dp = 2): string =>
  isFinite(value) ? percentage(value, dp) + "%" : ""
