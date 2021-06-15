import { selector, useRecoilValue } from "recoil"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"

export const govStateQuery = selector({
  key: "govState",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<GovState>(
      { contract: contracts["gov"], msg: { state: {} } },
      "govState"
    )
  },
})

export const useGovState = (): GovState | undefined => {
  return useRecoilValue(govStateQuery)
}
