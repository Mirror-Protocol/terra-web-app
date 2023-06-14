import {
  useWallet,
  WalletProvider,
  getChainOptions,
  WalletControllerChainOptions,
} from "@terra-money/wallet-provider"
import React, { PropsWithChildren, useEffect, useState } from "react"
import networks from "constants/networks"
import { useModal } from "components/Modal"
import ConnectListModal from "./ConnectListModal"
import { ConnectModalProvider } from "hooks/useConnectModal"
import { LCDClient } from "@terra-money/terra.js"

const WalletConnectProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const modal = useModal()
  const [chainOptions, setChainOptions] =
    useState<WalletControllerChainOptions>()

  useEffect(() => {
    getChainOptions().then((res) => setChainOptions(res))
  }, [])

  return chainOptions ? (
    <WalletProvider
      walletConnectChainIds={chainOptions.walletConnectChainIds}
      defaultNetwork={chainOptions.walletConnectChainIds[2]}
      connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
    >
      <ConnectModalProvider value={modal}>
        <ConnectListModal {...modal} isCloseBtn />
        {children}
      </ConnectModalProvider>
    </WalletProvider>
  ) : (
    <></>
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
    gasAdjustment: 2,
  })

  return { terra }
}
