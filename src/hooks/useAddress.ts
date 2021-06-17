import { useConnectedWallet } from "@terra-money/wallet-provider"

const useAddress = () => {
  const connectedWallet = useConnectedWallet()
  return connectedWallet?.terraAddress ?? ""
}

export default useAddress
