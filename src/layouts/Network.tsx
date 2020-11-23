import React, { FC } from "react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import { NetworkProvider, useNetworkState } from "../hooks/useNetwork"
import Reconnect from "./Reconnect"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all" },
}

const Network: FC = ({ children }) => {
  const network = useNetworkState()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  return !network.contract ? (
    <Reconnect {...network} />
  ) : (
    <NetworkProvider value={network} key={network.name}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NetworkProvider>
  )
}

export default Network
