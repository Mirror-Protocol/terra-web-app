import { isFinite, times } from "./math"
import { toFixed } from "./parse"

export const percentage = (value?: string, dp = 2): string =>
  isFinite(value) ? toFixed(times(value, 100), dp) : ""

export const percent = (value?: string, dp = 2): string =>
  isFinite(value) ? percentage(value, dp) + "%" : ""
