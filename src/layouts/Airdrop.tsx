import useAirdrops from "../statistics/useAirdrops"

const AirdropToast = () => {
  const airdrops = useAirdrops()
  return !airdrops?.length ? null : <AirdropToast />
}

export default AirdropToast
