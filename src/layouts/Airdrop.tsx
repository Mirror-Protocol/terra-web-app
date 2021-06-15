import useAirdrops from "../data/stats/airdrop"
import AirdropToast from "../pages/Airdrop/AirdropToast"

const Airdrop = () => {
  const airdrop = useAirdrops()
  return !airdrop ? null : <AirdropToast />
}

export default Airdrop
