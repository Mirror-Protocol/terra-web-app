import { noWait, selector, useRecoilValue } from "recoil"
import { times, floor, gt, plus } from "../libs/math"
import { format, formatAsset } from "../libs/parse"
import calc from "../libs/calc"
import { protocolQuery } from "../data/contract/protocol"
import { PriceKey } from "../hooks/contractKeys"
import { getLoadableContents } from "../data/utils/loadable"
import { pairPoolQuery } from "../data/contract/contract"
import { findPriceQuery, parsePairPool } from "../data/contract/normalize"

export const poolQuery = selector({
  key: "pool",
  get: ({ get }) => {
    const priceKey = PriceKey.PAIR
    const { getSymbol } = get(protocolQuery)
    const pairs = getLoadableContents(get(noWait(pairPoolQuery)))
    const find = get(findPriceQuery)

    /**
     * @param amount - Amount to provide(asset)/withdraw(lp)
     * @param token - Token of the asset to provide/withdraw
     */
    return ({ amount, token }: Asset) => {
      const pair = find(priceKey, token)
      const oracle = find(PriceKey.ORACLE, token)
      const price = gt(pair, 0) ? pair : oracle

      /* pair pool */
      const pairPool = pairs
        ? parsePairPool(pairs[token])
        : { uusd: "0", asset: "0", total: "0" }

      /* estimate uusd */
      const estimated = gt(amount, 0) ? floor(times(amount, price)) : "0"

      /* to lp */
      const deposits = [
        { amount, pair: pairPool.asset },
        { amount: estimated, pair: pairPool.uusd },
      ]

      const toLP = calc.toLP(deposits, pairPool.total)

      /* from lp */
      const shares = {
        asset: { amount: pairPool.asset, token },
        uusd: { amount: pairPool.uusd, token: "uusd" },
      }

      const fromLP = calc.fromLP(amount, shares, pairPool.total)
      const assetValueFromLP = times(find(priceKey, token), fromLP.asset.amount)
      const valueFromLP = plus(assetValueFromLP, fromLP.uusd.amount)

      return {
        toLP: {
          estimated,
          value: toLP,
          text: gt(estimated, 0) ? format(estimated, "uusd") : "0",
        },

        fromLP: {
          ...fromLP,
          value: valueFromLP,
          text: fromLP
            ? [fromLP.asset, fromLP.uusd]
                .map(({ amount, token }) =>
                  formatAsset(amount, getSymbol(token))
                )
                .join(" + ")
            : "0",
        },
      }
    }
  },
})

const usePool = () => {
  return useRecoilValue(poolQuery)
}

export default usePool
