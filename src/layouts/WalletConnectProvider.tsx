import { useWallet, WalletProvider } from "@terra-money/wallet-provider"
import { StationNetworkInfo } from "@terra-dev/chrome-extension"
import { ReadonlyWalletSession } from "@terra-dev/readonly-wallet"
import { FC } from "react"
import { mainnet, testnet } from "../networks"

const walletConnectChainIds: Record<number, StationNetworkInfo> = {
  0: testnet,
  1: mainnet,
}

async function createReadonlyWalletSession(): Promise<ReadonlyWalletSession> {
  const terraAddress = prompt("Terra address") || ""
  return { network: mainnet, terraAddress }
}

const WalletConnectProvider: FC = ({ children }) => (
  <WalletProvider
    defaultNetwork={mainnet}
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
  const networkInfo = { mainnet, testnet }[network.name]
  return networkInfo?.lcd
}
