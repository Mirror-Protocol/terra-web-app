import { selectorFamily, useRecoilValue } from "recoil"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"

export const mintPositionQuery = selectorFamily({
  key: "mintPosition",
  get:
    (idx: string) =>
    async ({ get }) => {
      const address = get(addressState)

      if (address && idx) {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<MintPosition>(
          {
            contract: contracts["mint"],
            msg: { position: { position_idx: idx } },
          },
          "mintPosition"
        )
      }
    },
})

export const useMintPosition = (idx?: string) => {
  return useRecoilValue(mintPositionQuery(idx ?? ""))
}
