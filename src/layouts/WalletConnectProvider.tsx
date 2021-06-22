import {
  useWallet,
  WalletProvider,
  NetworkInfo,
} from "@terra-money/wallet-provider"
import React, { FC } from "react"
import networks from "constants/networks"
import { useModal } from "components/Modal"
import ConnectListModal from "./ConnectListModal"
import { ConnectModalProvider } from "hooks/useConnectModal"

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
}
const defaultNetwork: NetworkInfo = networks.mainnet

const WalletConnectProvider: FC = ({ children }) => {
  const modal = useModal()

  return (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
    >
      <ConnectModalProvider value={modal}>
        <ConnectListModal {...modal} isCloseBtn />
        {children}
      </ConnectModalProvider>
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
