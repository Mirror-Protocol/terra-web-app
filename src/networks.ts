import { LCDClientConfig } from "@terra-money/terra.js"

export interface NetworkConfig {
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

const networks: Record<string, NetworkConfig> = {
  moonshine: {
    contract: "https://whitelist.mirror.finance/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev/",
    stats: "https://moonshine-graph.mirror.finance/graphql",
    lcd: { chainID: "moonshine", URL: "https://moonshine-lcd.terra.dev/" },
    fee: { gasPrice: 0.15, amount: 50000 }, // 0.050000 UST
  },
}

export default networks
