import { selector } from "recoil"
import * as anchor from "./anchor"

export const whitelistExternal = {
  ...anchor.assets,
}

export const externalPricesQuery = selector({
  key: "externalPrices",
  get: ({ get }) => ({ ...get(anchor.anchorPricesQuery) }),
})

export const externalBalancesQuery = selector({
  key: "externalBalances",
  get: ({ get }) => ({ ...get(anchor.anchorBalancesQuery) }),
})
