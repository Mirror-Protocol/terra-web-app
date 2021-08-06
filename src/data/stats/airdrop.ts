import { selector, useRecoilValue } from "recoil"
import { request } from "graphql-request"
import { gt } from "../../libs/math"
import { addressState } from "../wallet"
import { statsURLQuery } from "../network"
import { locationKeyState } from "../app"
import { AIRDROP } from "./gqldocs"

const airdropQuery = selector({
  key: "airdrop",
  get: async ({ get }) => {
    get(locationKeyState)
    const address = get(addressState)

    if (address) {
      const url = get(statsURLQuery)
      const { airdrop } = await request<{ airdrop: Airdrop[] }>(
        url + "?airdrop",
        AIRDROP,
        { address }
      )

      return airdrop.filter(({ amount }) => gt(amount, 0))[0]
    }
  },
})

const useAirdrop = () => {
  return useRecoilValue(airdropQuery)
}

export default useAirdrop
