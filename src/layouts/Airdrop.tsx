import { gt } from "../libs/math"
import useAirdrops from "../statistics/useAirdrops"
import AirdropToast from "../airdrop/AirdropToast"

const Airdrop = () => {
  const { amount } = useAirdrops()
  return !gt(amount, 0) ? null : <AirdropToast />
}

export default Airdrop
