import { plus, times, sum, gt } from "../../libs/math"
import { percent } from "../../libs/num"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import usePool from "../../forms/usePool"
import usePoolShare from "../../forms/usePoolShare"

const useMyPool = () => {
  const priceKey = PriceKey.PAIR
  const keys = [
    priceKey,
    BalanceKey.TOKEN,
    BalanceKey.LPTOTAL,
    BalanceKey.LPSTAKED,
  ]

  const { loading, data } = useCombineKeys(keys)
  const { listedAll } = useContractsAddress()
  const { find } = useContract()

  const getPool = usePool()
  const getPoolShare = usePoolShare()

  const dataSource = !data
    ? []
    : listedAll
        .map((item) => {
          const { token } = item
          const balance = find(BalanceKey.LPTOTAL, token)
          const { text } = getPool({ amount: balance, token })
          const poolShare = getPoolShare({ amount: balance, token })
          const { ratio, lessThanMinimum, minimum } = poolShare
          const prefix = lessThanMinimum ? "<" : ""

          return {
            ...item,
            balance,
            withdrawable: text.fromLP,
            share: prefix + percent(lessThanMinimum ? minimum : ratio),
          }
        })
        .filter(({ balance }) => gt(balance, 0))

  const getAssetValue = (asset: Asset) => {
    const price = find(priceKey, asset.token)
    return times(asset.amount, price)
  }

  const totalWithdrawableValue = sum(
    dataSource.map(({ balance, token }) => {
      const { fromLP } = getPool({ amount: balance, token })
      const assetValue = fromLP && getAssetValue(fromLP.asset)
      return plus(fromLP?.uusd.amount, assetValue)
    })
  )

  return { keys, loading, dataSource, totalWithdrawableValue }
}

export default useMyPool
