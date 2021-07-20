import { selectorFamily } from "recoil"
import { getContractQueriesQuery } from "../utils/queries"
import alias from "../contract/alias"
import { calcPairPrice, dict } from "../contract/normalize"
import { addressState } from "../wallet"

export const getPairPricesQuery = selectorFamily({
  key: "getPairPrices",
  get:
    (name: string) =>
    ({ get }) => {
      const getContractQueries = get(getContractQueriesQuery)
      return async (object: Dictionary<ListedItemExternal>) => {
        const document = alias(
          Object.values(object)
            .filter(({ pair }) => pair)
            .map(({ token, pair }) => {
              return { name: token, contract: pair, msg: { pool: {} } }
            }),
          name
        )

        const pairPool = await getContractQueries<PairPool>(document, name)
        return dict(pairPool, calcPairPrice)
      }
    },
})

export const getTokenBalancesQuery = selectorFamily({
  key: "getTokenBalances",
  get:
    (name: string) =>
    ({ get }) => {
      const address = get(addressState)

      const getContractQueries = get(getContractQueriesQuery)
      return async (object: Dictionary<ListedItemExternal>) => {
        if (address) {
          const document = alias(
            Object.values(object).map(({ token }) => ({
              name: token,
              contract: token,
              msg: { balance: { address } },
            })),
            name
          )

          const balances = await getContractQueries<Balance>(document, name)
          return dict(balances, ({ balance }) => balance)
        } else {
          return {}
        }
      }
    },
})
