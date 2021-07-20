import { selectorFamily, useRecoilValue } from "recoil"
import { Content } from "../../components/componentTypes"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"
import { useParsePoll } from "./parse"

export interface PollData {
  id: number
  end_time: number
  status: PollStatus
  creator: string

  deposit_amount: string

  yes_votes?: string
  no_votes?: string
  abstain_votes?: string
  total_balance_at_end_poll?: string
  voters_reward?: string

  title: string
  description: string
  link?: string

  execute_data: {
    contract: string
    msg: EncodedExecuteMsg
  }
}

export enum PollStatus {
  InProgress = "in_progress",
  Passed = "passed",
  Rejected = "rejected",
  Executed = "executed",
}

export interface Poll extends PollData {
  type?: string
  msg?: object
  params?: object
  contents?: Content[]
}

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
