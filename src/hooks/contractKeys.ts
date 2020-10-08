export enum PriceKey {
  // Dictionary<string>
  PAIR = "pair",
  ORACLE = "oracle",
}

export enum AssetInfoKey {
  // Dictionary<string>
  LIQUIDITY = "liquidity",
  MINCOLLATERALRATIO = "minCollateralRatio",
  LPTOTALSTAKED = "lpTotalStaked",
  LPTOTALSUPPLY = "lpTotalSupply",
}

export enum BalanceKey {
  // Dictionary<string>
  TOKEN = "token",
  LPSTAKABLE = "lpStakable",
  LPSTAKED = "lpStaked",
  MIRGOVSTAKED = "MIRGovStaked",
  REWARD = "reward",
}

export enum AccountInfoKey {
  // string | MintPosition[]
  UUSD = "uusd",
  MINTPOSITIONS = "mintPositions",
}
