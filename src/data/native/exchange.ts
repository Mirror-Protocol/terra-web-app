import { selector } from "recoil"
import { getNativeQueryQuery } from "../utils/query"
import { ORACLE_DENOMS_EXCHANGE_RATES } from "./gqldocs"

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
