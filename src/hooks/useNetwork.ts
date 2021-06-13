import { useCallback, useEffect, useState } from "react"
import { DEFAULT_EXT_NETWORK, FINDER } from "constants/constants"
import useLocalStorage from "libs/useLocalStorage"
import extension from "terra/extension"
import networks from "constants/networks"
import createContext from "./createContext"

const context = createContext<Network>("useNetwork")
export const [useNetwork, NetworkProvider] = context

/* state */
export const useNetworkState = (): Network => {
  const [extNetwork, setExtNetwork] = useLocalStorage(
    "network",
    DEFAULT_EXT_NETWORK
  )
  const [isInitialized, setIsInitialized] = useState(false)

  const refresh = useCallback(
    () => extension.info((network) => network && setExtNetwork(network)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (!isInitialized) {
      refresh()
      setIsInitialized(true)
    }
  }, [refresh, isInitialized])

  const network = networks[extNetwork.name]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${extNetwork.chainID}/${path}/${address}`

  return { ...extNetwork, ...network, finder, refresh }
}
