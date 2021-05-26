import { FC } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { QueryClient, QueryClientProvider } from "react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { HttpLink, ApolloLink } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import useNetwork from "../hooks/useNetwork"

const queryClient = new QueryClient()

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all", fetchPolicy: "network-only" },
}

const Network: FC = ({ children }) => {
  const { status } = useWallet()
  const network = useNetwork()

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

  return status === WalletStatus.INITIALIZING ? null : (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </QueryClientProvider>
  )
}

export default Network
