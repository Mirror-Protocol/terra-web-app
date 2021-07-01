import React, { FC } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import useNetwork from "hooks/useNetwork"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all" },
}

const Network: FC = ({ children }) => {
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
      {status === WalletStatus.INITIALIZING ? null : (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      )}
    </>
  )
}

export default Network
