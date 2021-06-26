import { atom, selector } from "recoil"
import { useStore, useStoreLoadable } from "../utils/loadable"
import * as anchor from "./anchor"

export const whitelistExternalQuery = selector({
  key: "whitelistExternal",
  get: ({ get }) => {
    const anchorProtocol = get(anchor.anchorProtocolQuery)
    return { ...anchorProtocol.assets }
  },
})

export const externalPricesQuery = selector({
  key: "externalPrices",
  get: ({ get }) => ({ ...get(anchor.anchorPricesQuery) }),
})

const externalPricesState = atom<Dictionary>({
  key: "externalPricesState",
  default: {},
})

export const externalBalancesQuery = selector({
  key: "externalBalances",
  get: ({ get }) => ({ ...get(anchor.anchorBalancesQuery) }),
})

const externalBalancesState = atom<Dictionary>({
  key: "externalBalancesState",
  default: {},
})

/* store */
export const useExternalPrices = () => {
  return useStoreLoadable(externalPricesQuery, externalPricesState)
}

export const useExternalBalances = () => {
  return useStore(externalBalancesQuery, externalBalancesState)
}
