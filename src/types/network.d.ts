interface Network extends NetworkConfig {
  /** Get finder link */
  finder: (address: string, path?: string) => string

  /** Refresh the network from the extension */
  refresh: () => void
}

type NetworkConfig = ExtNetworkConfig & LocalNetworkConfig

interface LocalNetworkConfig {
  /** Contract Addresses JSON URL */
  contract: string
  /** Graphql server URL */
  mantle: string
  stats: string
  /** Ethereum */
  shuttle: string
  /** Fixed fee */
  fee: { gasPrice: number; amount: number }
}

interface ExtNetworkConfig {
  name: string
  chainID: string
  lcd: string
}
