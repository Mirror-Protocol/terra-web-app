import { useMemo } from "react"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { ApolloLink, HttpLink } from "@apollo/client"
import { useNetwork } from "../hooks"
import { DefaultApolloClientOptions } from "../layouts/Network"

export const useStatsClient = () => {
  const { stats: uri } = useNetwork()

  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri })

    const namedLink = new ApolloLink((operation, forward) => {
      operation.setContext(() => ({ uri: `${uri}?${operation.operationName}` }))
      return forward ? forward(operation) : null
    })

    return new ApolloClient({
      link: ApolloLink.from([namedLink, httpLink]),
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: DefaultApolloClientOptions,
    })
  }, [uri])
  return client
}

export default useStatsClient
