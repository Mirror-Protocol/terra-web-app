import useAirdrops from "../statistics/useAirdrops"
import AirdropToast from "../airdrop/AirdropToast"

const Airdrop = () => {
  const airdrops = useAirdrops()
  return !airdrops?.length ? null : <AirdropToast />
}

export default Airdrop
