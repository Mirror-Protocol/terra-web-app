import { atom, selector } from "recoil"
import BigNumber from "bignumber.js"
import { gt } from "../../libs/math"
import { getContractQueriesQuery } from "../utils/queries"
import { useStoreLoadable } from "../utils/loadable"
import { pollsByIdsQuery } from "../gov/polls"
import { PollData } from "../gov/poll"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"
import alias from "./alias"

/* missing rewards */
const MISSING_REWARDS = [104, 105, 106, 107]

const govVoterQuery = selector({
  key: "govVoter",
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
        "voter"
      )

      return (await getContractQueries<Voter>(document, "voter")) ?? {}
    }

    return {}
  },
})

interface MissingRewardItem extends PollData, Voter {
  reward: string
}

export const missingRewardsQuery = selector({
  key: "missingRewards",
  get: ({ get }) => {
    const polls = get(pollsByIdsQuery(MISSING_REWARDS))
    const voters = get(govVoterQuery)

    return MISSING_REWARDS.reduce<MissingRewardItem[]>((acc, id) => {
      const poll = polls["poll" + id]
      const voter = voters["voter" + id]
      const reward = calcVotingRewards(poll, voter)
      const item = { ...poll, ...voter, reward }
      return gt(reward, 0) ? [...acc, item] : acc
    }, [])
  },
})

const missingRewardsState = atom<MissingRewardItem[]>({
  key: "missingRewardsState",
  default: [],
})

export const useMissingRewards = () => {
  return useStoreLoadable(missingRewardsQuery, missingRewardsState)
}

/* helpers */
const calcVotingRewards = (poll: PollData, voter?: Voter) => {
  const { voters_reward = 0 } = poll
  const { yes_votes = 0, no_votes = 0, abstain_votes = 0 } = poll

  return new BigNumber(voter?.balance ?? 0)
    .times(voters_reward)
    .div(BigNumber.sum(yes_votes, no_votes, abstain_votes))
    .toString()
}
