import { DEFAULT_NETWORK, FINDER } from "../constants"
import useLocalStorage from "../libs/useLocalStorage"
import networks, { NetworkConfig } from "../networks"
import createContext from "./createContext"

interface Network extends NetworkConfig {
  /** network */
  key: string
  setKey: (key: string) => void

  /** Get finder link */
  finder: (address: string, path?: string) => string
}

const context = createContext<Network>("useNetwork")
export const [useNetwork, NetworkProvider] = context

/* state */
export const useNetworkState = (): Network => {
  const [key, setKey] = useLocalStorage("network", DEFAULT_NETWORK)
  const network = networks[key]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${network.lcd.chainID}/${path}/${address}`

  return { ...network, key, setKey, finder }
}
