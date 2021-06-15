import { selectorFamily, useRecoilValue } from "recoil"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"
import { useParsePoll } from "./parse"

export const govPollQuery = selectorFamily({
  key: "govPoll",
  get:
    (id: number) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<PollData>(
        {
          contract: contracts["gov"],
          msg: { poll: { poll_id: id } },
        },
        "govPoll"
      )
    },
})

export const usePoll = (id: number) => {
  const poll = useRecoilValue(govPollQuery(id))
  const parsePoll = useParsePoll()
  return poll && parsePoll(poll)
}
