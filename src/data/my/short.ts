import { selector, useRecoilValue } from "recoil"
import { gt, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { protocolQuery } from "../contract/protocol"
import { findQuery, findStakingQuery } from "../contract/normalize"
import { rewardsQuery } from "../contract/normalize"
import { assetsHelpersQuery } from "../stats/assets"
import { StatsNetwork } from "../stats/statistic"

export const myShortFarmingQuery = selector({
  key: "myShortFarming",
  get: ({ get }) => {
    const priceKey = PriceKey.PAIR

    const { listedAll, getToken } = get(protocolQuery)
    const { shortAPR } = get(assetsHelpersQuery(StatsNetwork.TERRA))
    const mir = getToken("MIR")

    const find = get(findQuery)
    const findStaking = get(findStakingQuery)
    const rewards = get(rewardsQuery)

    const dataSource = listedAll
      .map((item: ListedItem) => {
        const { token } = item
        return {
          ...item,
          apr: shortAPR(token),
          shorted: findStaking(StakingKey.SLPSTAKED, token),
          reward: findStaking(StakingKey.SLPREWARD, token),
        }
      })
      .filter(({ shorted, reward }) =>
        [shorted, reward].some((balance) => balance && gt(balance, 0))
      )

    const price = find(priceKey, mir)
    const totalRewards = rewards.short
    const totalRewardsValue = times(rewards.short, price)

    return { dataSource, totalRewards, totalRewardsValue }
  },
})

export const useMyShortFarming = () => {
  return useRecoilValue(myShortFarmingQuery)
}
