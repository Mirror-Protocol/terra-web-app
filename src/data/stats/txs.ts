import { selectorFamily } from "recoil"
import { request } from "graphql-request"
import { usePagination } from "../utils/pagination"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { addressState } from "../wallet"
import { TXS } from "./gqldocs"

const LIMIT = 30

const txsQuery = selectorFamily({
  key: "txs",
  get:
    (offset: number | undefined = 0) =>
    async ({ get }) => {
      get(locationKeyState)
      const address = get(addressState)

      if (address) {
        const url = get(statsURLQuery)
        const { txs } = await request<{ txs: Tx[] }>(url + "?txs", TXS, {
          account: address,
          offset,
          limit: LIMIT,
        })

        return txs
          .filter(({ txHash }) => txHash)
          .filter(
            ({ type, data }) =>
              !["TERRA_SEND", "TERRA_RECEIVE"].includes(type) ||
              data.denom === "uusd"
          )
          .filter(
            ({ type, data }) =>
              type !== "TERRA_SWAP" ||
              [data.offer, data.swapCoin].some((string) =>
                string.endsWith("uusd")
              )
          )
      }
    },
})

const useTxs = () => {
  const next = ({ offset = 0 }) => offset + LIMIT
  return usePagination(txsQuery, next, LIMIT, "id")
}

export default useTxs
