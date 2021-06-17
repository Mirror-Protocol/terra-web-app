import {
  useWallet,
  WalletProvider,
  NetworkInfo,
} from "@terra-money/wallet-provider"
import React, { FC } from "react"
import networks from "constants/networks"

// const walletConnectChainIds: Record<number, NetworkInfo> = {
//   0: networks.testnet,
//   1: networks.mainnet,
// };
const defaultNetwork: NetworkInfo = networks.mainnet
const walletConnectChainIds = Object.keys(networks).map((key) => {
  const { name, chainID, lcd } = networks[key]
  return { name, chainID, lcd }
})

const WalletConnectProvider: FC = ({ children }) => {
  return (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      // connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
    >
      {children}
    </WalletProvider>
  )
}
export default WalletConnectProvider

/* hooks */
export const useLCD = () => {
  const { network } = useWallet()
  const networkInfo = networks[network.name]
  return networkInfo?.lcd
}
