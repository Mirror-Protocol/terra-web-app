import { atom, selector } from "recoil"
import { locationKeyState } from "../app"
import { getContractQueryQuery } from "../utils/query"
import { useStore } from "../utils/loadable"
import { iterateAllPage } from "../utils/pagination"
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

const limitOrdersState = atom<Order[]>({
  key: "limitOrdersState",
  default: [],
})

export const useLimitOrders = () => {
  return useStore(limitOrdersQuery, limitOrdersState)
}
