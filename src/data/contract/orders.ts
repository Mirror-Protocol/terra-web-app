import { selector, useRecoilValue } from "recoil"
import { locationKeyState } from "../app"
import { getContractQueryQuery } from "../utils/query"
import { iterateAllPageQuery } from "../utils/pagination"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"

export const LIMIT = 30

export const limitOrdersQuery = selector({
  key: "limitOrders",
  get: async ({ get }) => {
    get(locationKeyState)
    const address = get(addressState)

    if (address) {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const iterateAllPage = get(iterateAllPageQuery)

      const query = async (offset?: number) => {
        const response = await getContractQuery<{ orders: Order[] }>(
          {
            contract: contracts["limitOrder"],
            msg: {
              orders: {
                bidder_addr: address,
                limit: LIMIT,
                start_after: offset,
              },
            },
          },
          ["limitOrders", offset].filter(Boolean).join("-")
        )

        return response?.orders ?? []
      }

      return await iterateAllPage(query, (data) => data?.order_id, LIMIT)
    }

    return []
  },
})

export const useLimitOrders = () => {
  return useRecoilValue(limitOrdersQuery)
}
