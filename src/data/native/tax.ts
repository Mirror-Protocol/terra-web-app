import { selector } from "recoil"
import { request } from "graphql-request"
import { mantleURLQuery } from "../network"
import { TAX } from "./gqldocs"

export const taxQuery = selector({
  key: "tax",
  get: async ({ get }) => {
    // request once
    const url = get(mantleURLQuery)
    return await request<TaxData>(url + "?tax", TAX)
  },
})
