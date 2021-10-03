import { NetworkInfo } from "@terra-dev/wallet-types"

export enum NetworkKey {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}
type MirrorNetworkInfo = NetworkInfo & NetworkConfig

const networks: Record<string, MirrorNetworkInfo> = {
  mainnet: {
    name: "mainnet",
    chainID: "columbus-5",
    lcd: "https://lcd.terra.dev",
    fcd: "https://fcd.terra.dev",
    id: "columbus-5",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://fcd.terra.dev/",
    stats: "https://fcd.terra.dev/",
    fee: { gasPrice: "0.00506", amount: "1518", gas: "800000" }, // 0.000500 UST
    factory: "terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj",
    service:
      process.env.REACT_APP_MAINNET_SERVICE_URL || "https://api.terraswap.io/",
  },
  testnet: {
    name: "testnet",
    chainID: "bombay-12",
    lcd: "https://bombay-lcd.terra.dev",
    fcd: "https://bombay-fcd.terra.dev",
    id: "bombay-11",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://bombay-mantle.terra.dev/",
    stats: "https://bombay-fcd.terra.dev/",
    fee: { gasPrice: "0.15", amount: "50000", gas: "450000" }, // 0.050000 UST
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    service:
      process.env.REACT_APP_TESTNET_SERVICE_URL ||
      "https://api-bombay.terraswap.io/",
  },
}

export default networks
