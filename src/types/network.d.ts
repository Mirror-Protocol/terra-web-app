type NetworkConfig = ExtNetworkConfig & LocalNetworkConfig

interface Network extends NetworkConfig {
  /** Get finder link */
  finder: (address: string, path?: string) => string
}

interface ExtNetworkConfig {
  name: string
  chainID: string
}

interface LocalNetworkConfig {
  /** Contract Addresses JSON URL */
  contract: string
  /** Graphql server URL */
  mantle: string
  stats: string
  /** Contracts */
  shuttle: Record<ShuttleNetwork, string>
  limitOrder?: string
  /** Fixed fee */
  fee: { gasPrice: number; amount: number }
}

type ShuttleNetwork = "ethereum" | "bsc"
type ShuttleList = Record<ShuttleNetwork, Dictionary<string>>
