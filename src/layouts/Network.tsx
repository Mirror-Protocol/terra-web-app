import React, { FC } from "react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NetworkProvider, useNetworkState } from "../hooks/useNetwork"

const Network: FC = ({ children }) => {
  const network = useNetworkState()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: { notifyOnNetworkStatusChange: true },
      query: { errorPolicy: "all" },
    },
  })

  return (
    <NetworkProvider value={network} key={network.key}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NetworkProvider>
  )
}

export default Network
