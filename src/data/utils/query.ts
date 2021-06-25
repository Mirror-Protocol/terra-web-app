import { selector } from "recoil"
import { request } from "graphql-request"
import { RequestDocument, Variables } from "graphql-request/dist/types"
import { WASMQUERY } from "../../constants"
import { locationKeyState } from "../app"
import { mantleURLQuery } from "../network"
import { parseResult } from "./parse"
import { WASM } from "../native/gqldocs"

/* native */
export const getNativeQueryQuery = selector({
  key: "getNativeQuery",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(
      params: { document: RequestDocument; variables?: Variables },
      name: string
    ) => {
      const { document, variables } = params
      return await request<Parsed>(url + "?" + name, document, variables)
    }
  },
})

/* query */
export const getContractQueryQuery = selector({
  key: "getContractQuery",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(variables: ContractVariables, name: string) => {
      const document = getDocument(variables)

      const result = await request<WasmResponse>(
        url + "?" + name,
        WASM,
        document
      )

      return parseResult<Parsed>(result[WASMQUERY])
    }
  },
})

/* helpers */
export const getDocument = ({ contract, msg }: ContractVariables) => {
  return { contract, msg: JSON.stringify(msg) }
}
