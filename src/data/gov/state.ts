import { atom, selector } from "recoil"
import { protocolQuery } from "../contract/protocol"
import { useStoreLoadable } from "../utils/loadable"
import { getContractQueryQuery } from "../utils/query"

const INITIAL = { poll_count: 0, total_share: "0", total_deposit: "0" }

export const govStateQuery = selector({
  key: "govState",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const data = await getContractQuery<GovState>(
      { contract: contracts["gov"], msg: { state: {} } },
      "govState"
    )

    return data ?? INITIAL
  },
})

const govStateState = atom({
  key: "govStateState",
  default: INITIAL,
})

export const useGovState = (): GovState => {
  return useStoreLoadable(govStateQuery, govStateState)
}
