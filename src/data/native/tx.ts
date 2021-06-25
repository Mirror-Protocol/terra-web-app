import { request } from "graphql-request"
import { selector } from "recoil"
import { mantleURLQuery } from "../network"
import { TX_INFOS } from "./gqldocs"

export const getTxInfosQuery = selector({
  key: "getTxInfos",
  get: ({ get }) => {
    // request by hash
    const url = get(mantleURLQuery)
    return async (hash: string) => {
      const data = await request<TxInfos>(url + "?TxInfos", TX_INFOS, { hash })
      return data.TxInfos[0]
    }
  },
})
