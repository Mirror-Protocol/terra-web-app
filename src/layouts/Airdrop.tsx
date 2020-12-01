import useAirdrops from "../statistics/useAirdrops"
import AirdropToast from "../airdrop/AirdropToast"

const Airdrop = () => {
  const { airdrop } = useAirdrops()
  return !airdrop?.length ? null : <AirdropToast />
}

export default Airdrop
