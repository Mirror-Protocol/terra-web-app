import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { useWallet } from "@terra-money/wallet-provider"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import { addressState } from "../data/wallet"
import { locationKeyState } from "../data/app"
import { networkNameState } from "../data/network"

export const useLocationKey = () => {
  const { key } = useLocation()
  const setLocationKey = useSetRecoilState(locationKeyState)

  useEffect(() => {
    key && setLocationKey(key)
  }, [key, setLocationKey])
}

export const useInitAddress = () => {
  const address = useAddress()
  const setAddress = useSetRecoilState(addressState)
  useConnectGraph()

  useEffect(() => {
    setAddress(address || "")
  }, [address, setAddress])
}

export const useInitNetwork = () => {
  const wallet = useWallet()
  const { name } = wallet.network

  const setNetworkName = useSetRecoilState(networkNameState)
  useEffect(() => {
    setNetworkName(name)
  }, [name, setNetworkName])
}

export const useAlertByNetwork = () => {
  const { network } = useWallet()

  return (
    process.env.NODE_ENV !== "development" &&
    window.location.hostname === "terra-dev.mirror.finance" &&
    network.name !== "testnet"
  )
}
