export enum NetworkKey {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

const networks: Record<string, NetworkConfig> = {
  mainnet: {
    id: "columbus-4",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://fcd.terra.dev/",
    stats: "https://fcd.terra.dev/",
    lcd: { chainID: "columbus-4", URL: "https://fcd.terra.dev/" },
    fee: { gasPrice: "0.00506", amount: "1518", gas: "600000" },
    factory: "terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj",
    service: "https://api.terraswap.io/",
  },
  testnet: {
    id: "tequila-0004",
    contract: "/tequila.json",
    swap: "/swap.json",
    mantle: "https://tequila-mantle.terra.dev/",
    stats: "https://tequila-fcd.terra.dev/",
    lcd: { chainID: "tequila-0004", URL: "https://tequila-fcd.terra.dev/" },
    fee: { gasPrice: "0.15", amount: "50000", gas: "450000" },
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    service: "https://api-tequila.terraswap.io/",
  },
}

export default networks
