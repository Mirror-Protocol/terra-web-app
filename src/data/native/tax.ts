import { selector } from "recoil"
import { gql, request } from "graphql-request"
import { mantleURLQuery } from "../network"

export const TAX = gql`
  query tax {
    TreasuryTaxRate {
      Result
    }

    TreasuryTaxCapDenom(Denom: "uusd") {
      Result
    }
  }
`

export const taxQuery = selector({
  key: "tax",
  get: async ({ get }) => {
    const url = get(mantleURLQuery)
    return await request<TaxData>(url + "?tax", TAX)
  },
})
