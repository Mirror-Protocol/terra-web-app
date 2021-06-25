import { gt, sum, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { getAssetsHelpers, useAssetsByNetwork } from "../stats/assets"
import { useProtocol } from "../contract/protocol"
import { useFindPrice, useFindStaking, useRewards } from "../contract/normalize"
import usePool from "../../forms/modules/usePool"

export const useMyFarming = () => {
  const priceKey = PriceKey.PAIR
  const { listedAll, getToken, getIsDelisted } = useProtocol()
  const { contents: findStaking } = useFindStaking()
  const findPrice = useFindPrice()
  const rewards = useRewards()
  const getPool = usePool()
  const assets = useAssetsByNetwork()

  const longAPR = assets ? getAssetsHelpers(assets).longAPR : undefined
  const mir = getToken("MIR")

  const dataSource = listedAll
    .map((item: ListedItem) => {
      const { token } = item
      const balance = findStaking(StakingKey.LPSTAKED, token)
      const { fromLP } = getPool({ amount: balance, token })

      return {
        ...item,
        delisted: getIsDelisted(token),
        apr: longAPR?.(token),
        staked: findStaking(StakingKey.LPSTAKED, token),
        reward: findStaking(StakingKey.LPREWARD, token),
        withdrawable: fromLP,
      }
    })
    .filter(({ staked, reward }) =>
      [staked, reward].some((balance) => balance && gt(balance, 0))
    )

  const price = findPrice(priceKey, mir)
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
}
