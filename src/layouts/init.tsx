import { useWallet } from "@terra-money/wallet-provider"

export const useAlertByNetwork = () => {
  const { network } = useWallet()

  return (
    process.env.NODE_ENV !== "development" &&
    window.location.hostname === "terra.mirror.finance" &&
    network.name !== "mainnet"
  )
}
