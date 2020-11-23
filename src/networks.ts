import { LCDClientConfig } from "@terra-money/terra.js"

export enum NetworkKey {
  TEQUILA = "tequila",
  MOONSHINE = "moonshine",
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
  /** Fixed fee */
  fee: { gasPrice: number; amount: number }
}

const networks: Record<NetworkKey, NetworkConfig> = {
  [NetworkKey.TEQUILA]: {
    id: "tequila-0004",
    contract: "/tequila.json",
    mantle: "https://tequila-mantle.terra.dev",
    stats: "https://tequila-graph.mirror.finance/graphql",
    lcd: { chainID: "tequila-0004", URL: "https://tequila-lcd.terra.dev" },
    fee: { gasPrice: 0.0015, amount: 500 }, // 0.000500 UST
  },
  [NetworkKey.MOONSHINE]: {
    id: "moonshine",
    contract: "/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev",
    stats: "https://moonshine-graph.mirror.finance/graphql",
    lcd: { chainID: "moonshine", URL: "https://moonshine-lcd.terra.dev/" },
    fee: { gasPrice: 0.15, amount: 50000 }, // 0.050000 UST
  },
}

export default networks
