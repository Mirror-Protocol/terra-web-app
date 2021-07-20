import { selectorFamily } from "recoil"
import { useGovStaker } from "../contract/contract"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"

export const govVotersQuery = selectorFamily({
  key: "govVoters",
  get:
    (id: number) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const response = await getContractQuery<{ voters: Voter[] }>(
        {
          contract: contracts["gov"],
          msg: { voters: { poll_id: id, limit: Math.pow(2, 16) - 1 } },
        },
        "govVoters"
      )

      return response?.voters
    },
})

export const useGetVoted = () => {
  const { contents: govStaker } = useGovStaker()

  return (id: number) =>
    govStaker?.locked_balance.some(
      ([lockedId]: LockedBalance) => id === lockedId
    )
}
