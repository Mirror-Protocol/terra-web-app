import {
  NetworkInfo,
  WalletControllerChainOptions,
} from "@terra-money/wallet-provider"

type Response = Record<string, NetworkInfo>

const fallbackData = {
  mainnet: {
    name: "mainnet",
    chainID: "phoenix-1",
    lcd: "https://phoenix-lcd.terra.dev",
    api: "https://phoenix-api.terra.dev",
    hive: "https://phoenix-hive.terra.dev/graphql",
    walletconnectID: 1,
  },
  classic: {
    name: "classic",
    chainID: "columbus-5",
    lcd: "https://terra-classic-lcd.publicnode.com",
    api: "https://terra-classic-public-api.publicnode.com",
    mantle: "https://columbus-mantle.terra.dev",
    walletconnectID: 2,
  },
  testnet: {
    name: "testnet",
    chainID: "pisco-1",
    lcd: "https://pisco-lcd.terra.dev",
    api: "https://pisco-api.terra.dev",
    hive: "https://pisco-hive.terra.dev/graphql",
    walletconnectID: 0,
  },
  localterra: {
    name: "localterra",
    chainID: "localterra",
    lcd: "http://localhost:1317",
    mantle: "http://localhost:1337",
    walletconnectID: -1,
  },
}
export async function getChainOptions() {
  let data: Response
  try {
    data = (await (
      await fetch("https://assets.terra.dev/chains.json")
    ).json()) as Response
  } catch (error) {
    console.log(error)
    data = fallbackData
  }
  const chains = Object.values(data)
  const walletConnectChainIds = chains.reduce<
    WalletControllerChainOptions["walletConnectChainIds"]
  >((result, network) => {
    if (typeof network.walletconnectID === "number") {
      result[network.walletconnectID] = network
    } else if (!result[1] && network.name === "mainnet") {
      result[1] = network
    } else if (!result[0] && network.name === "testnet") {
      result[0] = network
    }
    return result
  }, {})
  const chainOptions: WalletControllerChainOptions = {
    defaultNetwork: walletConnectChainIds[1],
    walletConnectChainIds,
  }
  return chainOptions
}
