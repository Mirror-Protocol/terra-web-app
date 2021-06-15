import { gql, request } from "graphql-request"
import { selector } from "recoil"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"

export const ASSET = gql`
  query asset(
    $token: String!
    $interval: Float!
    $from: Float!
    $to: Float!
    $yesterday: Float!
  ) {
    asset(token: $token) {
      prices {
        price
        priceAt(timestamp: $yesterday)
        history(interval: $interval, from: $from, to: $to) {
          timestamp
          price
        }

        oraclePrice
      }

      statistic {
        liquidity
        volume
      }
    }
  }
`

interface Variables {
  token: string
  interval: number
  from: number
  to: number
  yesterday: number
}

export const getAssetQuery = selector({
  key: "getAsset",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(statsURLQuery)

    return async (variables: Variables) => {
      if (variables.token) {
        const { asset } = await request<{ asset: AssetData }>(
          url + "?asset",
          ASSET,
          variables
        )

        return asset
      }
    }
  },
})
