import BigNumber from "bignumber.js"
import { useRecoilValueLoadable } from "recoil"
import { taxQuery } from "../data/native/tax"
import { getLoadableContents } from "../data/utils/loadable"
import useFee from "./useFee"

export default () => {
  const taxLoadable = useRecoilValueLoadable(taxQuery)
  const data = getLoadableContents(taxLoadable)
  const fee = useFee()

  const rate = data?.TreasuryTaxRate.Result
  const cap = data?.TreasuryTaxCapDenom.Result

  const calcTax = (amount = "0") =>
    rate && cap
      ? BigNumber.min(new BigNumber(amount).times(rate), cap)
          .integerValue(BigNumber.ROUND_CEIL)
          .toString()
      : "0"

  const getMax = (balance = "0") => {
    if (rate && cap) {
      const balanceSafe = new BigNumber(balance).minus(1e6)
      const calculatedTax = new BigNumber(balanceSafe)
        .times(rate)
        .div(new BigNumber(1).plus(rate))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()

      const tax = BigNumber.min(calculatedTax, cap)
      const max = BigNumber.max(
        new BigNumber(balanceSafe).minus(tax).minus(fee.amount),
        0
      )

      return max.toString()
    } else {
      return "0"
    }
  }

  return { calcTax, getMax }
}
