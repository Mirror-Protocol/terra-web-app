import useLocalStorage from "../libs/useLocalStorage"
import extension from "../terra/extension"
import createContext from "./createContext"

interface Wallet {
  /** Terra wallet address */
  address: string
  /** Set as installed */
  install: () => void
  /** Extension installed */
  installed: boolean
  /** Connect wallet */
  connect: () => void
  /** Disconnect wallet */
  disconnect: () => void
}

export const [useWallet, WalletProvider] = createContext<Wallet>("useWallet")

/* state */
export const useWalletState = (): Wallet => {
  const init = extension.init()
  const [installed, setInstalled] = useLocalStorage("extension", init)
  const install = () => setInstalled(true)
  const [address, setAddress] = useLocalStorage("address", "")
  const connect = () => extension.connect(setAddress)
  const disconnect = () => setAddress("")
  return { address, install, installed, connect, disconnect }
}
