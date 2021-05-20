import { FC } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { HttpLink, ApolloLink } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import { NetworkProvider, useNetworkState } from "../hooks/useNetwork"

const queryClient = new QueryClient()

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all", fetchPolicy: "network-only" },
}

const Network: FC = ({ children }) => {
  const network = useNetworkState()

  const uri = network.mantle
  const httpLink = new HttpLink({ uri })
  const namedLink = new ApolloLink((operation, forward) => {
    operation.setContext(() => ({ uri: `${uri}?${operation.operationName}` }))
    return forward ? forward(operation) : null
  })

  const client = new ApolloClient({
    link: ApolloLink.from([namedLink, httpLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  return (
    <NetworkProvider value={network} key={network.name}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </QueryClientProvider>
    </NetworkProvider>
  )
}

export default Network
