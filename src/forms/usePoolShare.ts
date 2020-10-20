import { div, gt, lt } from "../libs/math"
import { useContract, useRefetch } from "../hooks"
import { AssetInfoKey } from "../hooks/contractKeys"

const MIN = div(0.01, 100) // <0.01%

export default (modifyTotal?: (total: string) => string) => {
  const infoKey = AssetInfoKey.LPTOTALSUPPLY
  const { find } = useContract()
  useRefetch([infoKey])

  return ({ amount, symbol }: Asset) => {
    const total = find(infoKey, symbol)
    const ratio = div(amount, modifyTotal?.(total) ?? total)

    return {
      ratio,
      lessThanMinimum: lt(ratio, MIN) && gt(ratio, 0),
      minimum: MIN,
    }
  }
}
