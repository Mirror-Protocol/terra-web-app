import BigNumber from "bignumber.js"
import useNetwork from "./useNetwork"

const useFee = (length = 1, gasAdjust = 1) => {
  const { fee } = useNetwork()
  const { gasPrice } = fee

  const amount = new BigNumber(fee.amount)
    .times(length)
    .times(gasAdjust)
    .toNumber()

  const gas = new BigNumber(amount)
    .div(gasPrice)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toNumber()

  return { ...fee, amount, gas }
}

export default useFee
