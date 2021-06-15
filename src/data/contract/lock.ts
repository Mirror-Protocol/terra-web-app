import { selector } from "recoil"
import { getContractQueriesQuery } from "../utils/queries"
import alias from "./alias"
import { shortPositionsQuery } from "./positions"
import { protocolQuery } from "./protocol"

export const lockPositionInfoQuery = selector({
  key: "lockPositionInfo",
  get: async ({ get }) => {
    const ids = get(shortPositionsQuery).map(({ idx }) => idx)
    const getContractQueries = get(getContractQueriesQuery)
    const { contracts } = get(protocolQuery)

    const document = alias(
      ids.map((id) => ({
        name: "position" + id,
        contract: contracts["lock"],
        msg: { position_lock_info: { position_idx: id } },
      })),
      "lockPositionInfo"
    )

    return (
      (await getContractQueries<LockPositionInfo>(
        document,
        "lockPositionInfo"
      )) ?? {}
    )
  },
})
