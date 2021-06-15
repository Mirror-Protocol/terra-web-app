import { selector, useRecoilValue } from "recoil"
import { gql, request } from "graphql-request"
import { gt } from "../../libs/math"
import { addressState } from "../wallet"
import { statsURLQuery } from "../network"
import { locationKeyState } from "../app"

const AIRDROP = gql`
  query airdrop($address: String!, $network: String = "TERRA") {
    airdrop(address: $address, network: $network)
  }
`

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
