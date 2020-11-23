import { FINDER } from "../constants"
import useLocalStorage from "../libs/useLocalStorage"
import networks, { NetworkKey, NetworkConfig } from "../networks"
import createContext from "./createContext"

interface Network extends NetworkConfig {
  /** Mainnet | Testnet */
  key: NetworkKey
  /** Mainnet | Testnet */
  setKey: (key: NetworkKey) => void

  /** Get finder link */
  finder: (address: string, path?: string) => string
}

const context = createContext<Network>("useNetwork")
export const [useNetwork, NetworkProvider] = context

/* state */
export const useNetworkState = (): Network => {
  const [key, setKey] = useLocalStorage("network", NetworkKey.TEQUILA)
  const network = networks[key]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${network.id}/${path}/${address}`

  return { ...network, key, setKey, finder }
}
