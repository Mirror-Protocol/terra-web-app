import { atom, selector } from "recoil"
import { protocolQuery } from "../contract/protocol"
import { useStoreLoadable } from "../utils/loadable"
import { getContractQueryQuery } from "../utils/query"

export const govConfigQuery = selector({
  key: "govConfig",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<GovConfig>(
      { contract: contracts["gov"], msg: { config: {} } },
      "govConfig"
    )
  },
})

const govConfigState = atom<GovConfig | undefined>({
  key: "govConfigState",
  default: undefined,
})

export const useGovConfig = () => {
  return useStoreLoadable(govConfigQuery, govConfigState)
}
