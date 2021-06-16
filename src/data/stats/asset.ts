import { request } from "graphql-request"
import { selector } from "recoil"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { ASSET } from "./gqldocs"

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
