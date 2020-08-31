import { useEffect } from "react"
import { DEFAULT_EXT_NETWORK, FINDER } from "../constants"
import useLocalStorage from "../libs/useLocalStorage"
import extension from "../terra/extension"
import networks from "../networks"
import createContext from "./createContext"

const context = createContext<Network>("useNetwork")
export const [useNetwork, NetworkProvider] = context

/* state */
export const useNetworkState = (): Network => {
  const [extNetwork, setExtNetwork] = useLocalStorage(
    "network",
    DEFAULT_EXT_NETWORK
  )

  const refresh = async () => {
    const network = await extension.info()
    setExtNetwork(network ?? DEFAULT_EXT_NETWORK)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line
  }, [])

  const network = networks[extNetwork.name]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${extNetwork.chainID}/${path}/${address}`

  return { ...extNetwork, ...network, finder, refresh }
}
