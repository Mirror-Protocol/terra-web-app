import { FC } from "react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import { NetworkProvider, useNetworkState } from "../hooks/useNetwork"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all", fetchPolicy: "network-only" },
}

const Network: FC = ({ children }) => {
  const network = useNetworkState()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  return (
    <NetworkProvider value={network} key={network.name}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NetworkProvider>
  )
}

export default Network
