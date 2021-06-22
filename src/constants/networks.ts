import { NetworkInfo } from "@terra-dev/wallet-types"

export enum NetworkKey {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}
type MirrorNetworkInfo = NetworkInfo & NetworkConfig

const networks: Record<string, MirrorNetworkInfo> = {
  mainnet: {
    name: "mainnet",
    chainID: "columbus-4",
    lcd: "https://lcd.terra.dev",
    fcd: "https://fcd.terra.dev",
    id: "columbus-4",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://fcd.terra.dev/",
    stats: "https://fcd.terra.dev/",
    fee: { gasPrice: "0.00506", amount: "1518", gas: "600000" }, // 0.000500 UST
    factory: "terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj",
    service:
      process.env.REACT_APP_MAINNET_SERVICE_URL || "https://api.terraswap.io/",
  },
  testnet: {
    name: "testnet",
    chainID: "tequila-0004",
    lcd: "https://tequila-lcd.terra.dev",
    fcd: "https://tequila-fcd.terra.dev",
    id: "tequila-0004",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://tequila-mantle.terra.dev/",
    stats: "https://tequila-fcd.terra.dev/",
    fee: { gasPrice: "0.15", amount: "50000", gas: "450000" }, // 0.050000 UST
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    service:
      process.env.REACT_APP_TESTNET_SERVICE_URL ||
      "https://api-tequila.terraswap.io/",
  },
}

export default networks
