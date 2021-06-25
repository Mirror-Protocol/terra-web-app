import { selector } from "recoil"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"

interface Params {
  pair: string
  token: string
  amount: string
  reverse: boolean
}

interface SimulatedData {
  return_amount: string
  offer_amount: string
  commission_amount: string
  spread_amount: string
}

export const pairSimulateQuery = selector({
  key: "pairSimulate",
  get: ({ get }) => {
    const { toToken } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)

    return async (params: Params) => {
      const { pair, token, amount, reverse } = params
      return await getContractQuery<SimulatedData>(
        {
          contract: pair,
          msg: !reverse
            ? { simulation: { offer_asset: toToken({ token, amount }) } }
            : { reverse_simulation: { ask_asset: toToken({ token, amount }) } },
        },
        "pairSimulate"
      )
    }
  },
})
