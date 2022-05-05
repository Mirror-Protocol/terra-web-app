import React, { PropsWithChildren } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import useNetwork from "hooks/useNetwork"
import Loading from "components/Loading"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all" },
}

const Network: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { status } = useWallet()
  const network = useNetwork()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

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
        <ApolloProvider client={client}>{children}</ApolloProvider>
      )}
    </>
  )
}

export default Network
