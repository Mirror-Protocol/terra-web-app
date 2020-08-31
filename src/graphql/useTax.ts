import { useQuery } from "@apollo/client"
import { ceil, min, times } from "../libs/math"
import { TAX } from "./gqldocs"

export default (amount?: string) => {
  const { data } = useQuery<TaxData>(TAX)
  return calcTax(amount, data)
}

/* parse */
const calcTax = (amount?: string, data?: TaxData) => {
  const rate = data?.TreasuryTaxRate.Result
  const cap = data?.TreasuryTaxCapDenom.Result
  return rate && cap && ceil(min([times(amount, rate), cap]))
}
