import {
  useWallet,
  useChainOptions,
  WalletProvider,
} from "@terra-money/wallet-provider"
import React, { FC } from "react"
import networks from "constants/networks"
import { useModal } from "components/Modal"
import ConnectListModal from "./ConnectListModal"
import { ConnectModalProvider } from "hooks/useConnectModal"

const WalletConnectProvider: FC = ({ children }) => {
  const modal = useModal()
  const chainOptions = useChainOptions();

  return (
    chainOptions && <WalletProvider
      {...chainOptions}
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
