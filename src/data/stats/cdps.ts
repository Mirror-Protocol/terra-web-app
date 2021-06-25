import { selectorFamily } from "recoil"
import { request } from "graphql-request"
import { statsURLQuery } from "../network"
import { locationKeyState } from "../app"
import { CDPS } from "./gqldocs"

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
