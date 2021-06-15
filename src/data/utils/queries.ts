import { selector, selectorFamily } from "recoil"
import { request } from "graphql-request"
import { RequestDocument } from "graphql-request/dist/types"
import alias from "../contract/alias"
import { protocolQuery } from "../contract/protocol"
import { locationKeyState } from "../app"
import { mantleURLQuery } from "../network"
import { parseResults } from "./parse"

export const LUNA: ListedItem = {
  token: "uluna",
  symbol: "Luna",
  name: "Luna",
  pair: "",
  lpToken: "",
  status: "LISTED",
}

/* queries */
export const getTokensContractQueriesQuery = selectorFamily({
  key: "getTokensContractQueries",
  get:
    (tokens: string[]) =>
    ({ get }) => {
      const getContractQueries = get(getContractQueriesQuery)

      return async <Parsed>(
        fn: (token: string) => ContractVariables,
        name: string
      ) => {
        const document = alias(
          tokens.map((token) => ({ name: token, ...fn(token) })),
          name
        )

        return await getContractQueries<Parsed>(document, name)
      }
    },
})

export const getListedContractQueriesQuery = selector({
  key: "getListedContractQueries",
  get: ({ get }) => {
    const { listedAll } = get(protocolQuery)
    const getContractQueries = get(getContractQueriesQuery)

    return async <Parsed>(fn: GetDocument, name: string) => {
      const document = alias(
        listedAll
          .filter((item) => fn(item))
          .map((item) => ({ name: item.token, ...fn(item) })),
        name
      )

      return await getContractQueries<Parsed>(document, name)
    }
  },
})

export const getContractQueriesQuery = selector({
  key: "getContractQueries",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<Dictionary<ContractData | null> | null>(
          url + "?" + name,
          document
        )

        return result ? parseResults<Parsed>(result) : undefined
      } catch (error) {
        const result = error.response.data
        return result ? parseResults<Parsed>(result) : undefined
      }
    }
  },
})
