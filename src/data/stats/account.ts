import { selector } from "recoil"
import { gql, request } from "graphql-request"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { addressState } from "../wallet"

const ACCOUNT = gql`
  query account($address: String!) {
    account(address: $address) {
      accumulatedGovReward
      voteHistory {
        pollId
        amount
        voteOption
      }
    }
  }
`

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
