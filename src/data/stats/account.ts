import { selector } from "recoil"
import { request } from "graphql-request"
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
