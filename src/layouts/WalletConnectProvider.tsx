import { NetworkInfo } from "@terra-money/wallet-provider"
import { useWallet, WalletProvider } from "@terra-money/wallet-provider"
import { FC } from "react"
import networks from "../networks"

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
}

const WalletConnectProvider: FC = ({ children }) => (
  <WalletProvider
    defaultNetwork={networks.mainnet}
    walletConnectChainIds={walletConnectChainIds}
    connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
  >
    {children}
  </WalletProvider>
)

export default WalletConnectProvider

/* hooks */
export const useLCD = () => {
  const { network } = useWallet()
  const networkInfo = networks[network.name]
  return networkInfo?.lcd
}
