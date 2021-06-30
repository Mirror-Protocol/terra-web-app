import { gt, sum, times } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useProtocol } from "../contract/protocol"
import { useFindBalance, useFindPrice } from "../contract/normalize"
import { useFindChange } from "../stats/assets"

export const useMyHolding = () => {
  const { listedAll, getIsDelisted } = useProtocol()
  const { contents: findBalance, isLoading } = useFindBalance()
  const findPrice = useFindPrice()
  const findChange = useFindChange()

  const dataSource = listedAll
    .map((item) => {
      const { token } = item
      const delisted = getIsDelisted(token)
      const priceKey = delisted ? PriceKey.END : PriceKey.PAIR
      const balance = findBalance(token)
      const price = findPrice(priceKey, token)
      const value = times(balance, price)
      const change =
        priceKey === PriceKey.PAIR ? findChange(priceKey, token) : undefined

      return { ...item, delisted, balance, price, value, change }
    })
    .filter(({ balance }) => gt(balance, 0))

  const totalValue = sum(dataSource.map(({ value }) => value))

  return { dataSource, totalValue, isLoading }
}
