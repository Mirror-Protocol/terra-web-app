import { MIR } from "../../constants"
import { gt, times } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import useDashboard from "../../statistics/useDashboard"

interface Item extends ListedItem {
  gov?: boolean
}

const useMyStake = () => {
  const priceKey = PriceKey.PAIR
  const keys = [
    priceKey,
    BalanceKey.TOKEN,
    BalanceKey.LPSTAKED,
    BalanceKey.LPSTAKABLE,
    BalanceKey.MIRGOVSTAKED,
    BalanceKey.REWARD,
  ]

  const { loading, data } = useCombineKeys(keys)
  const { listedAll, whitelist, getToken } = useContractsAddress()
  const { find, rewards } = useContract()

  const { apr } = useAssetStats()
  const { dashboard } = useDashboard()

  const mir = getToken(MIR)

  const getData = (item: Item) => {
    const { token, gov } = item

    return {
      ...item,
      apr: !gov ? apr[token] : dashboard?.govAPR,
      staked: find(!gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED, token),
      stakable: find(!gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN, token),
      reward: !gov ? find(BalanceKey.REWARD, token) : undefined,
    }
  }

  const dataSource = !data
    ? []
    : [
        ...insertIf(
          gt(find(BalanceKey.MIRGOVSTAKED, mir), 1),
          getData({ ...whitelist[mir], gov: true })
        ),
        ...listedAll
          .map(getData)
          .filter(({ staked, stakable, reward }) =>
            [staked, stakable, reward].some(
              (balance) => balance && gt(balance, 0)
            )
          ),
      ]

  const price = find(priceKey, mir)
  const totalRewards = rewards
  const totalRewardsValue = times(rewards, price)
  const govStakedValue = times(find(BalanceKey.MIRGOVSTAKED, mir), price)

  return {
    keys,
    loading,
    dataSource,
    price,
    totalRewards,
    totalRewardsValue,
    govStakedValue,
  }
}

export default useMyStake
