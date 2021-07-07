import { atom, selector } from "recoil"
import { sum } from "../../libs/math"
import { useStore } from "../utils/loadable"
import { govStakerQuery } from "../contract/contract"
import { missingRewardsQuery } from "../contract/gov"
import { lpRewardBalancesQuery } from "../contract/normalize"
import { slpRewardBalancesQuery } from "../contract/normalize"

export const farmingRewardsQuery = selector({
  key: "farmingRewards",
  get: ({ get }) => ({
    long: sum(Object.values(get(lpRewardBalancesQuery) ?? {})),
    short: sum(Object.values(get(slpRewardBalancesQuery) ?? {})),
  }),
})

export const votingRewardsQuery = selector({
  key: "votingRewards",
  get: ({ get }) => get(govStakerQuery)?.pending_voting_rewards ?? "0",
})

export const missingRewardsTotalQuery = selector({
  key: "missingRewardsTotal",
  get: ({ get }) => {
    const missingRewards = get(missingRewardsQuery)
    return sum(missingRewards.map(({ reward }) => reward ?? 0))
  },
})

export const rewardsQuery = selector({
  key: "rewards",
  get: ({ get }) => {
    const { long, short } = get(farmingRewardsQuery)
    const voting = get(votingRewardsQuery)
    const total = sum([long, short, voting])
    return { long, short, voting, total }
  },
})

const rewardsState = atom({
  key: "rewardsState",
  default: rewardsQuery,
})

export const useRewards = () => {
  return useStore(rewardsQuery, rewardsState)
}
