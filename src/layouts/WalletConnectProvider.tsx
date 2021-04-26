import { useWallet, WalletProvider } from "@terra-money/wallet-provider"
import { StationNetworkInfo } from "@terra-dev/chrome-extension"
import { ReadonlyWalletSession } from "@terra-dev/readonly-wallet"
import { FC } from "react"
import networks from "../networks"

const walletConnectChainIds: Record<number, StationNetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
}

async function createReadonlyWalletSession(): Promise<ReadonlyWalletSession> {
  const terraAddress = prompt("Terra address") || ""
  return { network: networks.mainnet, terraAddress }
}

const WalletConnectProvider: FC = ({ children }) => (
  <WalletProvider
    defaultNetwork={networks.mainnet}
    walletConnectChainIds={walletConnectChainIds}
    createReadonlyWalletSession={createReadonlyWalletSession}
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
