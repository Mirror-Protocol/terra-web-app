import { NetworkInfo } from "@terra-dev/wallet-types"

export enum NetworkKey {
  MAINNET = "classic",
}
type MirrorNetworkInfo = NetworkInfo & NetworkConfig

export const AVAILABLE_CHAIN_ID = ["columbus-5"]

const networks: Record<string, MirrorNetworkInfo> = {
  classic: {
    name: "classic",
    chainID: "columbus-5",
    lcd: "https://columbus-lcd.terra.dev",
    fcd: "https://columbus-fcd.terra.dev",
    id: "columbus-5",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://fcd.terra.dev/",
    stats: "https://fcd.terra.dev/",
    fee: { gasPrice: "0.00506", amount: "1518", gas: "2000000" }, // 0.000500 UST
    factory: "terra1jkndu9w5attpz09ut02sgey5dd3e8sq5watzm0",
    service:
      process.env.REACT_APP_MAINNET_SERVICE_URL ||
      "https://api-classic.terraswap.io/v2",
    serviceV1:
      process.env.REACT_APP_MAINNET_SERVICE_V1_URL ||
      "https://api-classic.terraswap.io/v1",
    dashboard: process.env.REACT_APP_MAINNET_DASHBOARD_URL,
    router: "terra1g3zc8lwwmkrm0cz9wkgl849pdqaw6cq8lh7872",
  },
}

export default networks
