import { atom, selector } from "recoil"
import { DEFAULT_SLIPPAGE } from "../../constants"
import { div, isFinite } from "../../libs/math"
import { dp, validateDp } from "../../libs/parse"

export const slippageInputState = atom({
  key: "slippageInputState",
  default: String(JSON.parse(localStorage.getItem("slippage") || "1")),
})

export const slippageInputErrorQuery = selector({
  key: "slippageError",
  get: ({ get }) => {
    const value = get(slippageInputState)
    return !validateDp(value)
      ? `Slippage must be within ${dp()} decimal points`
      : ""
  },
})

export const slippageQuery = selector({
  key: "slippage",
  get: ({ get }) => {
    const value = get(slippageInputState)
    const error = get(slippageInputErrorQuery)

    return isFinite(value) && !error
      ? div(value, 100)
      : String(DEFAULT_SLIPPAGE)
  },
})
