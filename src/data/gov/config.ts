import { selector, useRecoilValue } from "recoil"
import { protocolQuery } from "../contract/protocol"
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

export const useGovConfig = (): GovConfig | undefined => {
  return useRecoilValue(govConfigQuery)
}
