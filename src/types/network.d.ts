interface Network extends NetworkConfig {
  /** Get finder link */
  finder: (address: string, path?: string) => string

  /** Refresh the network from the extension */
  refresh: () => void
}

interface LocalNetworkConfig {
  /** Chain ID */
  id: string
  /** Contract Addresses JSON URL */
  contract: string
  /** Swap Contract Addresses JSON URL */
  swap: string
  /** Graphql server URL */
  mantle: string
  stats: string
  /** LCDClientConfig */
  lcd: LCDClientConfig
  /** Fixed fee */
  fee: { gasPrice: string; amount: string; gas: string }
  factory: string
  service: string
  serviceV1: string
  dashboard: string
  router: string
}

interface ExtNetworkConfig {
  name: string
  chainID: string
  lcd: string
  fcd: string
}

type NetworkConfig = ExtNetworkConfig & LocalNetworkConfig
