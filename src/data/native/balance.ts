import { atom, selector } from "recoil"
import { useStoreLoadable } from "../utils/loadable"
import { getNativeQueryQuery } from "../utils/query"
import { nativeBalancesQuery } from "../contract/normalize"
import { addressState } from "../wallet"
import { BANK_BALANCES_ADDRESS } from "./gqldocs"

export const bankBalanceIndexState = atom({
  key: "bankBalanceIndexState",
  default: 0,
})

export const bankBalanceQuery = selector({
  key: "bankBalance",
  get: async ({ get }) => {
    get(bankBalanceIndexState)
    const address = get(addressState)

    if (address) {
      const getNativeQuery = get(getNativeQueryQuery)
      return await getNativeQuery<BankBalanceAddress>(
        { document: BANK_BALANCES_ADDRESS, variables: { address } },
        "BankBalancesAddress"
      )
    }
  },
})

/* uusd balance */
export const uusdBalanceQuery = selector({
  key: "uusdBalanceQuery",
  get: ({ get }) => {
    const { uusd } = get(nativeBalancesQuery)
    return uusd
  },
})

export const uusdBalanceState = atom({
  key: "uusdBalanceState",
  default: "0",
})

export const useUusdBalance = () => {
  return useStoreLoadable(uusdBalanceQuery, uusdBalanceState)
}
