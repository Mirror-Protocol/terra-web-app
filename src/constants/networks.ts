import { NetworkInfo } from "@terra-dev/wallet-types"

export enum NetworkKey {
  MAINNET = "classic",
  TESTNET = "testnet",
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
      "https://api-classic.terraswap.io/",
    dashboard: process.env.REACT_APP_MAINNET_DASHBOARD_URL,
    router: "terra1g3zc8lwwmkrm0cz9wkgl849pdqaw6cq8lh7872",
  },
  testnet: {
    name: "testnet",
    chainID: "bombay-12",
    lcd: "https://bombay-lcd.terra.dev",
    fcd: "https://bombay-fcd.terra.dev",
    id: "bombay-12",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://bombay-mantle.terra.dev/",
    stats: "https://bombay-fcd.terra.dev/",
    fee: { gasPrice: "0.00506", amount: "1518", gas: "2000000" }, // 0.050000 UST
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    service:
      process.env.REACT_APP_TESTNET_SERVICE_URL ||
      "https://api-bombay.terraswap.io/",
    dashboard: process.env.REACT_APP_TESTNET_DASHBOARD_URL,
    router: "terra14z80rwpd0alzj4xdtgqdmcqt9wd9xj5ffd60wp",
  },
}

export default networks
