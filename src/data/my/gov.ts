import { selector, useRecoilValue } from "recoil"
import { gt, times } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { protocolQuery } from "../contract/protocol"
import { govStakerQuery } from "../contract/contract"
import { findQuery, govStakedQuery } from "../contract/normalize"
import { pollsByIdsQuery } from "../gov/polls"
import { statsAccountQuery } from "../stats/account"

const voteHistoryQuery = selector({
  key: "voteHistory",
  get: ({ get }) => {
    const account = get(statsAccountQuery)
    const voteHistory = account?.voteHistory
    const govStaker = get(govStakerQuery)

    if (!govStaker) return []

    const ids = [
      ...govStaker.locked_balance.map(([id]) => id),
      ...govStaker.withdrawable_polls.map(([id]) => id),
    ]

    const pollsByIds = Object.values(get(pollsByIdsQuery(ids)))

    if (!voteHistory || !pollsByIds) return []

    return [
      ...govStaker.locked_balance.map(([id, { balance, vote }]) => {
        return {
          id,
          title: pollsByIds.find((poll) => poll.id === id)?.title,
          vote,
          amount: balance,
        }
      }),
      ...govStaker.withdrawable_polls.map(([id, reward]) => {
        const item = voteHistory.find(({ pollId }) => Number(pollId) === id)
        return {
          id,
          title: pollsByIds.find((poll) => poll.id === id)?.title,
          vote: item?.voteOption,
          amount: item?.amount,
          reward,
        }
      }),
    ].sort(({ id: a }, { id: b }) => b - a)
  },
})

const accGovRewardQuery = selector({
  key: "accGovReward",
  get: ({ get }) => {
    const account = get(statsAccountQuery)
    const reward = account?.accumulatedGovReward ?? "0"
    return gt(reward, 0) ? reward : "0"
  },
})

export const myGovQuery = selector({
  key: "myGov",
  get: ({ get }) => {
    const priceKey = PriceKey.PAIR

    const { getToken } = get(protocolQuery)
    const mir = getToken("MIR")

    const find = get(findQuery)
    const govStaked = get(govStakedQuery)
    const govStaker = get(govStakerQuery)

    const price = find(priceKey, mir)
    const valid = gt(govStaked, 1)

    const staked = valid ? govStaked : "0"
    const stakedValue = valid ? times(staked, price) : "0"

    const votingRewards = govStaker?.pending_voting_rewards ?? "0"
    const votingRewardsValue = times(votingRewards, price)

    const accReward = get(accGovRewardQuery)
    const dataSource = get(voteHistoryQuery)

    return {
      dataSource,
      staked,
      stakedValue,
      votingRewards,
      votingRewardsValue,
      accReward,
    }
  },
})

export const useMyGov = () => {
  return useRecoilValue(myGovQuery)
}
