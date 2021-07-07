import { atom, selector, selectorFamily } from "recoil"
import BigNumber from "bignumber.js"
import { gt } from "../../libs/math"
import { useStore } from "../utils/loadable"
import { getContractQueriesQuery } from "../utils/queries"
import { getContractQueryQuery } from "../utils/query"
import { pollsByIdsQuery } from "../gov/polls"
import { PollData } from "../gov/poll"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"
import alias from "./alias"

export interface VoteHistoryItem extends PollData, Voter {
  reward?: string
}

export const govAddressVoterQuery = selectorFamily({
  key: "govAddressVoter",
  get:
    (id: number) =>
    async ({ get }) => {
      const address = get(addressState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)

      if (address) {
        const query = {
          contract: contracts["gov"],
          msg: { voter: { poll_id: id, address } },
        }

        return await getContractQuery<Voter>(query, "voter")
      }
    },
})

/* missing rewards */
const MISSING_REWARDS = [104, 105, 106, 107]

const govAddressVotersQuery = selector({
  key: "govAddressVoters",
  get: async ({ get }) => {
    const address = get(addressState)
    const { contracts } = get(protocolQuery)
    const getContractQueries = get(getContractQueriesQuery)

    if (address) {
      const document = alias(
        MISSING_REWARDS.map((id) => ({
          name: "voter" + id,
          contract: contracts["gov"],
          msg: { voter: { poll_id: id, address } },
        })),
        "voters"
      )

      return (await getContractQueries<Voter>(document, "voters")) ?? {}
    }

    return {}
  },
})

export const missingRewardsQuery = selector({
  key: "missingRewards",
  get: ({ get }) => {
    const polls = get(pollsByIdsQuery(MISSING_REWARDS))
    const voters = get(govAddressVotersQuery)

    return MISSING_REWARDS.reduce<VoteHistoryItem[]>((acc, id) => {
      const poll = polls["poll" + id]
      const voter = voters["voter" + id]
      const reward = calcVotingRewards(poll, voter)
      const item = { ...poll, ...voter, reward }
      return gt(reward, 0) ? [...acc, item] : acc
    }, [])
  },
})

const missingRewardsState = atom<VoteHistoryItem[]>({
  key: "missingRewardsState",
  default: [],
})

export const useMissingRewards = () => {
  return useStore(missingRewardsQuery, missingRewardsState)
}

/* helpers */
export const calcVotingRewards = (poll: PollData, voter?: Voter) => {
  const { voters_reward = 0 } = poll
  const { yes_votes = 0, no_votes = 0, abstain_votes = 0 } = poll

  return new BigNumber(voter?.balance ?? 0)
    .times(voters_reward)
    .div(BigNumber.sum(yes_votes, no_votes, abstain_votes))
    .toString()
}
