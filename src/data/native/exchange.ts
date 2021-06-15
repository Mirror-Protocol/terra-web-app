import { selector } from "recoil"
import { gql } from "graphql-request"
import { getNativeQueryQuery } from "../utils/query"

const ORACLE_DENOMS_EXCHANGE_RATES = gql`
  query OracleDenomsExchangeRates {
    OracleDenomsExchangeRates {
      Height
      Result {
        Amount
        Denom
      }
    }
  }
`

export const exchangeRatesQuery = selector({
  key: "exchangeRates",
  get: async ({ get }) => {
    const getNativeQuery = get(getNativeQueryQuery)
    return await getNativeQuery<OracleDenomsExchangeRates>(
      { document: ORACLE_DENOMS_EXCHANGE_RATES },
      "OracleDenomsExchangeRates"
    )
  },
})
