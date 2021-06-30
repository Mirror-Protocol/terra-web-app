import { atom, selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import { useStore } from "../utils/loadable"
import { iterateAllPage } from "../utils/pagination"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"

export const LIMIT = 30

export const mintPositionsQuery = selector({
  key: "mintPositions",
  get: async ({ get }) => {
    const address = get(addressState)

    if (address) {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)

      const query = async (offset?: string) => {
        const response = await getContractQuery<MintPositions>(
          {
            contract: contracts["mint"],
            msg: {
              positions: Object.assign(
                { owner_addr: address, limit: LIMIT },
                offset && { start_after: offset }
              ),
            },
          },
          ["mintPositions", offset].filter(Boolean).join("-")
        )

        return response?.positions ?? []
      }

      return await iterateAllPage(query, (data) => data?.idx, LIMIT)
    }

    return []
  },
})

const mintPositionsState = atom<MintPosition[]>({
  key: "mintPositionsState",
  default: [],
})

export const shortPositionsQuery = selector({
  key: "shortPositions",
  get: ({ get }) => {
    const positions = get(mintPositionsQuery)
    return positions.filter(({ is_short }) => is_short)
  },
})

/* hooks */
export const useMintPositions = () => {
  return useStore(mintPositionsQuery, mintPositionsState)
}
