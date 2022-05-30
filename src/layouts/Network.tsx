import React, { PropsWithChildren, useEffect } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import useNetwork from "hooks/useNetwork"
import Loading from "components/Loading"
import { useModal } from "components/Modal"
import UnsupportedNetworkModal from "components/UnsupportedNetworkModal"
import { AVAILABLE_CHAIN_ID } from "constants/networks"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all" },
}

const Network: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { status } = useWallet()
  const network = useNetwork()
  const unsupportedNetworkModal = useModal()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (network && !AVAILABLE_CHAIN_ID.includes(network?.chainID)) {
        unsupportedNetworkModal.open()
      }
    }, 10)

    return () => {
      clearTimeout(timerId)
    }
  }, [unsupportedNetworkModal, network])

  return (
    <>
      {status === WalletStatus.INITIALIZING ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      ) : (
        <ApolloProvider client={client}>
          {!unsupportedNetworkModal.isOpen && children}
        </ApolloProvider>
      )}
      <UnsupportedNetworkModal isOpen={unsupportedNetworkModal.isOpen} />
    </>
  )
}

export default Network
