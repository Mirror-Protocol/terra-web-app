import { request } from "graphql-request"
import { atomFamily, selectorFamily } from "recoil"
import { useStoreLoadable } from "../utils/loadable"
import { statsURLQuery } from "../network"
import { locationKeyState } from "../app"
import { ASSET } from "./gqldocs"

interface Variables {
  token: string
  from: number
  to: number
  interval: number
}

type SerializedVariables = [string, number, number, number]

export const assetHistoryQuery = selectorFamily({
  key: "assetHistory",
  get:
    ([token, from, to, interval]: SerializedVariables) =>
    async ({ get }) => {
      get(locationKeyState)
      const url = get(statsURLQuery)
      const { asset } = await request<{ asset: AssetHistoryData }>(
        url + "?asset",
        ASSET,
        { token, from, to, interval }
      )

      return asset.prices.history
    },
})

const assetHistoryState = atomFamily<PriceHistoryItem[], SerializedVariables>({
  key: "assetHistoryState",
  default: [],
})

export const useAssetHistory = (variables: Variables) => {
  const { token, from, to, interval } = variables
  return useStoreLoadable(
    assetHistoryQuery([token, from, to, interval]),
    assetHistoryState([token, from, to, interval])
  )
}
