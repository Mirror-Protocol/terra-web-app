import { LCDClientConfig } from "@terra-money/terra.js"

export enum NetworkKey {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export interface NetworkConfig {
  /** Chain ID */
  id: string
  /** Contract Addresses JSON URL */
  contract: string
  /** Graphql server URL */
  mantle: string
  stats: string
  /** LCDClientConfig */
  lcd: LCDClientConfig
}

const networks: Record<NetworkKey, NetworkConfig> = {
  [NetworkKey.MAINNET]: {
    id: "tequila-0004",
    contract: "/tequila.json",
    mantle: "https://tequila-api.mirrorprotocol.com/graphql",
    stats: "https://tequila-graph.mirrorprotocol.com/graphql",
    lcd: { chainID: "tequila-0004", URL: "https://tequila-lcd.terra.dev" },
  },
  [NetworkKey.TESTNET]: {
    id: "moonshine",
    contract: "/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev/",
    stats: "https://moonshine-graph.mirrorprotocol.com/graphql",
    lcd: { chainID: "localterra", URL: "https://moonshine-lcd.terra.dev/" },
  },
}

export default networks
