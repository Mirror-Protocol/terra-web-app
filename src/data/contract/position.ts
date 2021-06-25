import { atomFamily, selectorFamily } from "recoil"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"
import { useStoreLoadable } from "../utils/loadable"

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

const mintPositionState = atomFamily<MintPosition | undefined, string>({
  key: "mintPositionState",
  default: undefined,
})

export const useMintPosition = (idx: string) => {
  return useStoreLoadable(mintPositionQuery(idx), mintPositionState(idx))
}
