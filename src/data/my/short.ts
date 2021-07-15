import { gt, max, number, sum, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { useProtocol } from "../contract/protocol"
import { useFindPrice, useFindStaking } from "../contract/normalize"
import { useRewards } from "./rewards"
import { getAssetsHelpers, useAssetsByNetwork } from "../stats/assets"
import { useMyLockedUST } from "./locked"

export const useMyShortFarming = () => {
  const priceKey = PriceKey.PAIR
  const { listedAll, getToken, getIsDelisted } = useProtocol()
  const { contents: findStaking, isLoading } = useFindStaking()
  const findPrice = useFindPrice()
  const { contents: rewards, isLoading: isLoadingRewards } = useRewards()
  const myLockedUST = useMyLockedUST()
  const assets = useAssetsByNetwork()

  const shortAPR = assets ? getAssetsHelpers(assets).shortAPR : undefined
  const mir = getToken("MIR")

  const dataSource = listedAll
    .map((item: ListedItem) => {
      const { token } = item
      const lockedInfo = myLockedUST.dataSource.filter(
        (lockedItem) => lockedItem.token === token
      )

      return {
        ...item,
        delisted: getIsDelisted(token),
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

  const price = findPrice(priceKey, mir)
  const totalRewards = rewards.short
  const totalRewardsValue = times(rewards.short, price)

  return {
    ...myLockedUST,
    dataSource,
    totalRewards,
    totalRewardsValue,
    isLoading: isLoading || isLoadingRewards,
  }
}
