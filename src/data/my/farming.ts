import { selector, useRecoilValue } from "recoil"
import { gt, sum, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { assetsHelpersQuery } from "../stats/assets"
import { StatsNetwork } from "../stats/statistic"
import { protocolQuery } from "../contract/protocol"
import { findQuery, findStakingQuery } from "../contract/normalize"
import { rewardsQuery } from "../contract/normalize"
import { poolQuery } from "../../forms/usePool"

export const myFarmingQuery = selector({
  key: "myFarming",

  get: ({ get }) => {
    const priceKey = PriceKey.PAIR

    const { listedAll, getToken } = get(protocolQuery)
    const { longAPR } = get(assetsHelpersQuery(StatsNetwork.TERRA))
    const getPool = get(poolQuery)
    const mir = getToken("MIR")

    const find = get(findQuery)
    const findStaking = get(findStakingQuery)
    const rewards = get(rewardsQuery)

    const dataSource = listedAll
      .map((item: ListedItem) => {
        const { token } = item
        const balance = findStaking(StakingKey.LPSTAKED, token)
        const { fromLP } = getPool({ amount: balance, token })

        return {
          ...item,
          apr: longAPR(token),
          staked: findStaking(StakingKey.LPSTAKED, token),
          reward: findStaking(StakingKey.LPREWARD, token),
          withdrawable: fromLP,
        }
      })
      .filter(({ staked, reward }) =>
        [staked, reward].some((balance) => balance && gt(balance, 0))
      )

    const price = find(priceKey, mir)
    const totalRewards = rewards.long
    const totalRewardsValue = times(rewards.long, price)
    const totalWithdrawableValue = sum(
      dataSource.map(({ withdrawable }) => withdrawable?.value ?? 0)
    )

    return {
      dataSource,
      totalRewards,
      totalRewardsValue,
      totalWithdrawableValue,
    }
  },
})

export const useMyFarming = () => {
  return useRecoilValue(myFarmingQuery)
}
