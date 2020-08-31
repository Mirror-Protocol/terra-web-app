import { div, gt, lt } from "../libs/math"
import { percent } from "../libs/num"
import { useContract, useRefetch } from "../hooks"
import { AssetInfoKey } from "../hooks/contractKeys"

const MIN = div(0.01, 100) // <0.01%

export default (modifyTotal?: (total: string) => string) => {
  const infoKey = AssetInfoKey.LPTOTALSUPPLY
  const { find } = useContract()
  useRefetch([infoKey])

  return ({ amount, token }: Asset) => {
    const total = find(infoKey, token)
    const ratio = div(amount, modifyTotal?.(total) ?? total)
    const lessThanMinimum = lt(ratio, MIN) && gt(ratio, 0)
    const prefix = lessThanMinimum ? "<" : ""

    return {
      ratio,
      lessThanMinimum,
      minimum: MIN,
      prefix,
      text: `${prefix}${percent(lessThanMinimum ? MIN : ratio)}`,
    }
  }
}
