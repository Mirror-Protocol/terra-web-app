import { gt, sum, times } from "../../libs/math"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"
import useYesterday, { calcChange } from "../../statistics/useYesterday"

const useMyHoldings = () => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN
  const keys = [priceKey, balanceKey]

  const { loading, data } = useCombineKeys(keys)
  const { listedAll } = useContractsAddress()
  const { find } = useContract()
  const { [priceKey]: yesterday } = useYesterday()

  const dataSource = !data
    ? []
    : listedAll
        .map((item) => {
          const { token } = item
          const balance = find(balanceKey, token)
          const price = find(priceKey, token)
          const value = times(balance, price)
          const change = calcChange({
            today: price,
            yesterday: yesterday[token],
          })

          return { ...item, balance, price, value, change }
        })
        .filter(({ balance }) => gt(balance, 0))

  const totalValue = sum(dataSource.map(({ value }) => value))

  return { keys, loading, totalValue, dataSource }
}

export default useMyHoldings
