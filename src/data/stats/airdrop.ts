import { atom, selector } from "recoil"
import { request } from "graphql-request"
import { gt } from "../../libs/math"
import { useStoreLoadable } from "../utils/loadable"
import { addressState } from "../wallet"
import { statsURLQuery } from "../network"
import { AIRDROP } from "./gqldocs"

const airdropQuery = selector({
  key: "airdrop",
  get: async ({ get }) => {
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

const airdropState = atom<Airdrop | undefined>({
  key: "airdropState",
  default: undefined,
})

const useAirdrop = () => {
  return useStoreLoadable(airdropQuery, airdropState)
}

export default useAirdrop
