import { selector, useRecoilValue } from "recoil"
import { gt, sum, times } from "../../libs/math"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"
import { protocolQuery } from "../contract/protocol"
import { findQuery } from "../contract/normalize"
import { findChangeQuery } from "../stats/assets"

export const myHoldingQuery = selector({
  key: "myHolding",
  get: ({ get }) => {
    const balanceKey = BalanceKey.TOKEN
    const { listedAll, getIsDelisted } = get(protocolQuery)
    const find = get(findQuery)
    const findChange = get(findChangeQuery)

    const dataSource = listedAll
      .map((item) => {
        const { token } = item
        const priceKey = getIsDelisted(token) ? PriceKey.END : PriceKey.PAIR

        const balance = find(balanceKey, token)
        const price = find(priceKey, token)
        const value = times(balance, price)
        const change = findChange(PriceKey.PAIR, token)

        return { ...item, balance, price, value, change }
      })
      .filter(({ balance }) => gt(balance, 0))

    const totalValue = sum(dataSource.map(({ value }) => value))

    return { dataSource, totalValue }
  },
})

export const useMyHolding = () => {
  return useRecoilValue(myHoldingQuery)
}
