import { atom, selector } from "recoil"
import { request } from "graphql-request"
import { useStore } from "../utils/loadable"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { addressState } from "../wallet"
import { ACCOUNT } from "./gqldocs"

export const statsAccountQuery = selector({
  key: "statsAccount",
  get: async ({ get }) => {
    get(locationKeyState)
    const address = get(addressState)

    if (address) {
      const url = get(statsURLQuery)
      const { account } = await request<{ account: StatsAccount }>(
        url + "?account",
        ACCOUNT,
        { address }
      )

      return account
    }
  },
})

const statsAccountState = atom<StatsAccount | undefined>({
  key: "statsAccountState",
  default: undefined,
})

export const useStatsAccount = () => {
  return useStore(statsAccountQuery, statsAccountState)
}
