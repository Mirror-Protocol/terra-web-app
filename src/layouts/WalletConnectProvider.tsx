import { FC } from "react"
import { NetworkInfo, WalletStatus } from "@terra-money/wallet-provider"
import { useWallet } from "@terra-money/wallet-provider"
import { WalletProvider } from "@terra-money/wallet-provider"
import networks, { defaultNetwork } from "../networks"
import Reconnect from "./Reconnect"

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
  2: networks.moonshine,
}

const WithInitialized: FC = ({ children }) => {
  const { status, network } = useWallet()
  const initialized = status !== WalletStatus.INITIALIZING
  const invalidNetwork = !networks[network.name]

  return !initialized ? null : invalidNetwork ? (
    <Reconnect {...network} />
  ) : (
    <>{children}</>
  )
}

const createReadonlyWalletSession = async () => {
  const terraAddress = prompt()
  return terraAddress ? { network: defaultNetwork, terraAddress } : null
}

const WalletConnectProvider: FC = ({ children }) => (
  <WalletProvider
    defaultNetwork={defaultNetwork}
    walletConnectChainIds={walletConnectChainIds}
    createReadonlyWalletSession={createReadonlyWalletSession}
    connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
  >
    <WithInitialized>{children}</WithInitialized>
  </WalletProvider>
)

export default WalletConnectProvider
