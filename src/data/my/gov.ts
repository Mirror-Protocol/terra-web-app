import { atom, selector } from "recoil"
import { gt, times } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useStoreLoadable } from "../utils/loadable"
import { useProtocol } from "../contract/protocol"
import { useGovStaker } from "../contract/contract"
import { useFindPrice, useGovStaked } from "../contract/normalize"
import { usePollsByIds } from "../gov/polls"
import { statsAccountQuery, useStatsAccount } from "../stats/account"

const useVoteHistory = () => {
  const account = useStatsAccount()
  const voteHistory = account?.voteHistory
  const govStaker = useGovStaker()

  const ids = !govStaker
    ? []
    : [
        ...govStaker.locked_balance.map(([id]) => id),
        ...govStaker.withdrawable_polls.map(([id]) => id),
      ]

  const pollsByIds = usePollsByIds(ids)
  const pollsByIdsValues = Object.values(pollsByIds)

  if (!voteHistory || !pollsByIdsValues) return []

  return !govStaker
    ? []
    : [
        ...govStaker.locked_balance.map(([id, { balance, vote }]) => {
          return {
            id,
            title: pollsByIdsValues.find((poll) => poll.id === id)?.title,
            vote,
            amount: balance,
          }
        }),
        ...govStaker.withdrawable_polls.map(([id, reward]) => {
          const item = voteHistory.find(({ pollId }) => Number(pollId) === id)
          return {
            id,
            title: pollsByIdsValues.find((poll) => poll.id === id)?.title,
            vote: item?.voteOption,
            amount: item?.amount,
            reward,
          }
        }),
      ].sort(({ id: a }, { id: b }) => b - a)
}

const accGovRewardQuery = selector({
  key: "accGovReward",
  get: ({ get }) => {
    const account = get(statsAccountQuery)
    const reward = account?.accumulatedGovReward ?? "0"
    return gt(reward, 0) ? reward : "0"
  },
})

const accGovRewardState = atom({
  key: "accGovRewardState",
  default: "0",
})

const useAccGovReward = () => {
  return useStoreLoadable(accGovRewardQuery, accGovRewardState)
}

export const useMyGov = () => {
  const priceKey = PriceKey.PAIR

  const { getToken } = useProtocol()
  const mir = getToken("MIR")

  const findPrice = useFindPrice()
  const govStaked = useGovStaked()
  const govStaker = useGovStaker()
  const accReward = useAccGovReward()
  const dataSource = useVoteHistory()

  const price = findPrice(priceKey, mir)
  const valid = gt(govStaked, 1)

  const staked = valid ? govStaked : "0"
  const stakedValue = valid ? times(staked, price) : "0"

  const votingRewards = govStaker?.pending_voting_rewards ?? "0"
  const votingRewardsValue = times(votingRewards, price)

  return {
    dataSource,
    staked,
    stakedValue,
    votingRewards,
    votingRewardsValue,
    accReward,
  }
}
