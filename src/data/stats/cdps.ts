import { selectorFamily } from "recoil"
import { gql, request } from "graphql-request"
import { statsURLQuery } from "../network"
import { locationKeyState } from "../app"

const CDPS = gql`
  query cdps($tokens: [String!]) {
    cdps(maxRatio: 9999, tokens: $tokens) {
      id
      address
      token
      mintAmount
      collateralToken
      collateralAmount
      collateralRatio
    }
  }
`

export const cdpsQuery = selectorFamily({
  key: "cdps",
  get:
    (token: string) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const { cdps } = await request<{ cdps: CDP[] }>(url + "?cdps", CDPS, {
        tokens: [token],
      })

      return cdps
    },
})
