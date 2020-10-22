import { UUSD } from "../constants"
import { times, floor, gt } from "../libs/math"
import { format, formatAsset } from "../libs/parse"
import calc from "../helpers/calc"
import { useContract, useContractsAddress, useRefetch } from "../hooks"
import { PriceKey } from "../hooks/contractKeys"
import { parsePairPool } from "../graphql/useNormalize"

export default () => {
  const priceKey = PriceKey.PAIR
  const { getListedItem } = useContractsAddress()
  const { parsed, find } = useContract()
  useRefetch([priceKey])

  return ({ amount, symbol }: Asset) => {
    const expectLP = (pairPool: PairPool) => {
      const { uusd, asset, total } = parsePairPool(pairPool)
      const deposits = [
        { amount, pair: asset },
        { amount: estimated, pair: uusd },
      ]

      return calc.toLP(deposits, total)
    }

    const expectReturn = (
      pairPool: PairPool
    ): { asset: Asset; uusd: Asset } => {
      const { uusd, asset, total } = parsePairPool(pairPool)

      const shares = {
        asset: { amount: asset, symbol },
        uusd: { amount: uusd, symbol: UUSD },
      }

      return calc.fromLP(amount, shares, total)
    }

    const price = find(priceKey, symbol)
    const estimated = price && gt(amount, 0) ? floor(times(amount, price)) : "0"

    const { token } = getListedItem(symbol)
    const pairPool = parsed[PriceKey.PAIR]?.[token]

    const toLP = pairPool ? expectLP(pairPool) : undefined
    const fromLP = pairPool ? expectReturn(pairPool) : undefined

    const text = {
      toLP: gt(estimated, 0) ? format(estimated, UUSD) : "-",
      fromLP: fromLP
        ? Object.values(fromLP)
            ?.map(({ amount, symbol }) => formatAsset(amount, symbol))
            .join(" + ")
        : "-",
    }

    return { uusdEstimated: estimated, toLP, fromLP, text }
  }
}
