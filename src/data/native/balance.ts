import { atom, selector } from "recoil"
import { gql } from "graphql-request"
import { useStoreLoadable } from "../utils/loadable"
import { getNativeQueryQuery } from "../utils/query"
import { nativeBalancesQuery } from "../contract/normalize"
import { addressState } from "../wallet"

const BANK_BALANCES_ADDRESS = gql`
  query BankBalancesAddress($address: String) {
    BankBalancesAddress(Address: $address) {
      Result {
        Amount
        Denom
      }
    }
  }
`

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

/* state */
export const uusdBalanceState = atom({
  key: "uusdBalanceState",
  default: "0",
})

export const uusdBalanceQuery = selector({
  key: "uusdBalanceQuery",
  get: ({ get }) => {
    const { uusd } = get(nativeBalancesQuery)
    return uusd
  },
})

export const useUusdBalance = () => {
  return useStoreLoadable(uusdBalanceState, uusdBalanceQuery)
}
