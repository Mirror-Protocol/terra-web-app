import { NetworkInfo } from "@terra-dev/wallet-types"

type MirrorNetworkInfo = NetworkInfo & LocalNetworkConfig

const networks: Record<string, MirrorNetworkInfo> = {
  mainnet: {
    name: "mainnet",
    chainID: "columbus-5",
    lcd: "https://lcd.terra.dev",
    contract: "https://whitelist.mirror.finance/columbus.json",
    mantle: "https://mantle.terra.dev/",
    stats: "https://graph.mirror.finance/graphql",
    shuttle: {
      ethereum: "terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc",
      bsc: "terra1g6llg3zed35nd3mh9zx6n64tfw3z67w2c48tn2",
    },
    fee: { gasPrice: 0.456, amount: 300000 }, // 0.3 UST
  },
  testnet: {
    name: "testnet",
    chainID: "bombay-12",
    lcd: "https://bombay-lcd.terra.dev",
    contract: "https://whitelist.mirror.finance/bombay.json",
    mantle: "https://bombay-mantle.terra.dev/",
    stats: "https://bombay-mirror-graph.terra.dev/graphql",
    shuttle: {
      ethereum: "terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3",
      bsc: "terra1paav7jul3dzwzv78j0k59glmevttnkfgmgzv2r",
    },
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.15 UST
  },
  moonshine: {
    name: "moonshine",
    chainID: "localterra",
    lcd: "https://moonshine-lcd.terra.dev",
    contract: "https://whitelist.mirror.finance/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev",
    stats: "https://moonshine-mirror-graph.terra.dev/graphql",
    shuttle: {
      ethereum: "",
      bsc: "",
    },
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.15 UST
  },
}

export const defaultNetwork = networks.mainnet

export default networks
