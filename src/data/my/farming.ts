import { div, gt, sum, times } from "../../libs/math"
import { PriceKey, StakingKey } from "../../hooks/contractKeys"
import { getAssetsHelpers, useAssetsByNetwork } from "../stats/assets"
import { useProtocol } from "../contract/protocol"
import { useFindPrice, useFindStaking } from "../contract/normalize"
import { useLpTokensTotalSupplyQuery } from "../contract/info"
import { useRewards } from "./rewards"
import usePool from "../../forms/modules/usePool"

export const useMyFarming = () => {
  const priceKey = PriceKey.PAIR
  const { listedAll, getToken, getIsDelisted } = useProtocol()
  const { contents: findStaking, isLoading } = useFindStaking()
  const findPrice = useFindPrice()
  const { contents: rewards, isLoading: isLoadingRewards } = useRewards()
  const getPool = usePool()
  const assets = useAssetsByNetwork()
  const lpTokensTotalSupply = useLpTokensTotalSupplyQuery()

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
        share: lpTokensTotalSupply[token]
          ? div(balance, lpTokensTotalSupply[token])
          : undefined,
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
    isLoading: isLoading || isLoadingRewards,
  }
}
