import { selectorFamily } from "recoil"
import { gql, request } from "graphql-request"
import { usePagination } from "../utils/pagination"
import { locationKeyState } from "../app"
import { statsURLQuery } from "../network"
import { addressState } from "../wallet"

const LIMIT = 30

const TXS = gql`
  query txs($account: String!, $offset: Float, $limit: Float) {
    txs(account: $account, offset: $offset, limit: $limit) {
      createdAt
      id
      height
      txHash
      address
      type
      data
      token
      datetime
      fee
      memo
    }
  }
`

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
  return usePagination(txsQuery, ({ offset = 0 }) => offset + LIMIT, LIMIT)
}

export default useTxs
