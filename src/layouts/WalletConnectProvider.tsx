import { useWallet, WalletProvider } from "@terra-money/wallet-provider"
import { StationNetworkInfo } from "@terra-dev/chrome-extension"
import { FC } from "react"
import networks from "../networks"

const walletConnectChainIds: Record<number, StationNetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
}

const WalletConnectProvider: FC = ({ children }) => (
  <WalletProvider
    defaultNetwork={networks.mainnet}
    walletConnectChainIds={walletConnectChainIds}
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
