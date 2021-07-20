import { useWallet } from "@terra-money/wallet-provider"
import { FINDER } from "../constants"
import networks from "../networks"

const useNetwork = () => {
  const { network: extNetwork } = useWallet()

  const network = networks[extNetwork.name]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${extNetwork.chainID}/${path}/${address}`

  return { ...extNetwork, ...network, finder }
}

export default useNetwork
