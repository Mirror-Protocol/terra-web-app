import { useCallback, useEffect } from "react"
import { useMutation } from "@apollo/client"
import useLocalStorage from "../libs/useLocalStorage"
import extension from "../terra/extension"
import { CONNECT } from "../statistics/gqldocs"
import useStatsClient from "../statistics/useStatsClient"
import createContext from "./createContext"
import { useNetwork } from "./useNetwork"

interface Wallet {
  /** Terra wallet address */
  address: string
  /** Extension installed */
  installed: boolean
  /** Set as installed */
  install: () => void
  /** Connect wallet */
  glance: (address: string) => void
  connect: () => void
  /** Disconnect wallet */
  disconnect: () => void
}

export const [useWallet, WalletProvider] = createContext<Wallet>("useWallet")

/* state */
export const useWalletState = (): Wallet => {
  /* init */
  const init = extension.init
  const [installed, setInstalled] = useLocalStorage("extension", init)
  const install = () => setInstalled(true)

  /* connect */
  const [address, setAddress] = useLocalStorage("address", "")

  const glance = setAddress

  const connect = useCallback(async () => {
    const response = await extension.connect()
    response?.address && setAddress(response.address)
  }, [setAddress])

  const disconnect = () => setAddress("")

  useConnectGraph(address)

  // Log in as the address of the extension when user enters the app
  // even if there is an address on the local storage.
  useEffect(() => {
    address && connect()
  }, [address, connect])

  return { address, installed, install, glance, connect, disconnect }
}

/* graph */
const useConnectGraph = (address: string) => {
  const { stats } = useNetwork()
  const client = useStatsClient()
  const [connectToGraph] = useMutation(CONNECT, { client })

  useEffect(() => {
    address && stats && connectToGraph({ variables: { address } })
  }, [address, stats, connectToGraph])
}
