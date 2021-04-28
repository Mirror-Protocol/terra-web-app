import BigNumber from "bignumber.js"
import { useNetwork } from "../hooks"

const useFee = () => {
  const { fee } = useNetwork()
  const { amount, gasPrice } = fee

  const gas = new BigNumber(amount)
    .div(gasPrice)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toNumber()

  return { ...fee, gas }
}

export default useFee
