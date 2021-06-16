import { atom, noWait, selector } from "recoil"
import { gt, sum, times } from "../../libs/math"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import { getLoadableContents, useStoreLoadable } from "../utils/loadable"
import { protocolQuery } from "../contract/protocol"
import { findQuery } from "../contract/normalize"
import { changesQuery } from "../stats/assets"

export const myHoldingQuery = selector({
  key: "myHolding",
  get: ({ get }) => {
    const { listedAll, getIsDelisted } = get(protocolQuery)
    const find = get(findQuery)
    const changesLoadable = get(noWait(changesQuery))
    const changes = getLoadableContents(changesLoadable)

    const dataSource = listedAll
      .map((item) => {
        const { token } = item
        const priceKey = getIsDelisted(token) ? PriceKey.END : PriceKey.PAIR

        const balance = find(BalanceKey.TOKEN, token)
        const price = find(priceKey, token)
        const value = times(balance, price)
        const change =
          priceKey === PriceKey.PAIR ? changes?.[token]?.[priceKey] : undefined

        return { ...item, balance, price, value, change }
      })
      .filter(({ balance }) => gt(balance, 0))

    const totalValue = sum(dataSource.map(({ value }) => value))

    return { dataSource, totalValue }
  },
})

const myHoldingState = atom({
  key: "myHoldingState",
  default: myHoldingQuery,
})

export const useMyHolding = () => {
  return useStoreLoadable(myHoldingQuery, myHoldingState)
}
