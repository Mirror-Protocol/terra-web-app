import {
  useWallet,
  WalletProvider,
  NetworkInfo,
} from "@terra-money/wallet-provider"
import React, { PropsWithChildren } from "react"
import networks from "constants/networks"
import { useModal } from "components/Modal"
import ConnectListModal from "./ConnectListModal"
import { ConnectModalProvider } from "hooks/useConnectModal"
import { LCDClient } from "@terra-money/terra.js"

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.classic,
}
const defaultNetwork: NetworkInfo = networks.classic

const WalletConnectProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
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

export const useLCDClient = () => {
  const { network } = useWallet()
  const networkInfo = networks[network.name]
  const terra = new LCDClient({
    URL: networkInfo?.lcd,
    chainID: network.chainID,
    gasAdjustment: 1.5,
  })

  return { terra }
}
