const networks: Record<string, LocalNetworkConfig> = {
  testnet: {
    contract: "https://whitelist.mirror.finance/tequila.json",
    mantle: "https://tequila-mantle.terra.dev/",
    stats: "https://tequila-graph.mirror.finance/graphql",
    fee: { gasPrice: 0.15, amount: 50000 }, // 0.050000 UST
  },
  moonshine: {
    contract: "https://whitelist.mirror.finance/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev/",
    stats: "https://moonshine-graph.mirror.finance/graphql",
    fee: { gasPrice: 0.15, amount: 50000 }, // 0.050000 UST
  },
}

export default networks
