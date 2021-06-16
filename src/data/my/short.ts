import { atom, noWait, selector } from "recoil"
import { gt, max, number, sum, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { getLoadableContents, useStoreLoadable } from "../utils/loadable"
import { protocolQuery } from "../contract/protocol"
import { findQuery, findStakingQuery } from "../contract/normalize"
import { rewardsQuery } from "../contract/normalize"
import { assetsByNetworkState, getAssetsHelpers } from "../stats/assets"
import { StatsNetwork } from "../stats/statistic"
import { myLockedUSTQuery } from "./locked"

export const myShortFarmingQuery = selector({
  key: "myShortFarming",
  get: ({ get }) => {
    const priceKey = PriceKey.PAIR
    const { listedAll, getToken } = get(protocolQuery)
    const mir = getToken("MIR")

    const findStaking = get(findStakingQuery)
    const find = get(findQuery)
    const rewards = get(rewardsQuery)
    const myLockedUST = get(myLockedUSTQuery)

    const assets = getLoadableContents(
      get(noWait(assetsByNetworkState(StatsNetwork.TERRA)))
    )

    const shortAPR = assets ? getAssetsHelpers(assets).shortAPR : undefined

    const dataSource = listedAll
      .map((item: ListedItem) => {
        const { token } = item
        const lockedInfo = myLockedUST.dataSource.filter(
          (lockedItem) => lockedItem.token === token
        )

        return {
          ...item,
          apr: shortAPR?.(token),
          locked: sum(lockedInfo.map(({ locked }) => locked)),
          unlocked: sum(lockedInfo.map(({ unlocked }) => unlocked)),
          unlock_time: number(
            max(lockedInfo.map(({ unlock_time }) => unlock_time))
          ),
          shorted: findStaking(StakingKey.SLPSTAKED, token),
          reward: findStaking(StakingKey.SLPREWARD, token),
        }
      })
      .filter(({ shorted, locked, unlocked, reward }) =>
        [shorted, locked, unlocked, reward].some(
          (balance) => balance && gt(balance, 0)
        )
      )

    const price = find(priceKey, mir)
    const totalRewards = rewards.short
    const totalRewardsValue = times(rewards.short, price)

    return { ...myLockedUST, dataSource, totalRewards, totalRewardsValue }
  },
})

const myShortFarmingState = atom({
  key: "myShortFarmingState",
  default: myShortFarmingQuery,
})

export const useMyShortFarming = () => {
  return useStoreLoadable(myShortFarmingQuery, myShortFarmingState)
}
