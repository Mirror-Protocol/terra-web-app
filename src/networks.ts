const networks: Record<string, LocalNetworkConfig> = {
  mainnet: {
    contract: "https://whitelist.mirror.finance/columbus.json",
    mantle: "https://mantle.terra.dev/",
    stats: "https://graph.mirror.finance/graphql",
    shuttle: "terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc",
    fee: { gasPrice: 0.0015, amount: 1000 }, // 0.001000 UST
  },
  testnet: {
    contract: "https://whitelist.mirror.finance/tequila.json",
    mantle: "https://tequila-mantle.terra.dev/",
    stats: "https://tequila-graph.mirror.finance/graphql",
    shuttle: "terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3",
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.150000 UST
  },
  moonshine: {
    contract: "https://whitelist.mirror.finance/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev/",
    stats: "https://moonshine-graph.mirror.finance/graphql",
    shuttle: "",
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.150000 UST
  },
}

export default networks
