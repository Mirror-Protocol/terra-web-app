import { selectorFamily, useRecoilValue } from "recoil"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"

export const limitOrderQuery = selectorFamily({
  key: "limitOrder",
  get:
    (id: number) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<Order>(
        {
          contract: contracts["limitOrder"],
          msg: { order: { order_id: id } },
        },
        "limitOrder"
      )
    },
})

export const useLimitOrder = (id: number) => {
  return useRecoilValue(limitOrderQuery(id))
}
