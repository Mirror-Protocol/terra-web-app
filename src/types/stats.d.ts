interface Dashboard {
  assetMarketCap: string
  govAPR: string

  mirSupply: MIRSupply
  totalValueLocked: TVL

  latest24h: {
    transactions: string
    volume: string
    feeVolume: string
  }
}

interface DashboardHistory {
  liquidityHistory: ChartItem[]
  tradingVolumeHistory: ChartItem[]
}

interface MIRSupply {
  circulating: string
  liquidity: string
  staked: string
}

interface TVL {
  total: string
  liquidity: string
  collateral: string
  stakedMir: string
}

interface ChartItem {
  timestamp: number
  value: string
}

/* account */
interface StatsAccount {
  accumulatedGovReward: string
  voteHistory: VoteItem[]
}

interface VoteItem {
  pollId: string
  amount: string
  voteOption: VoteAnswer
}

/* asset */
interface AssetDataItem {
  token: string
  description?: string

  prices: {
    price: string
    priceAt: string
    oraclePrice: string
  }

  statistic: {
    liquidity: string
    shortValue: string
    volume: string
    apr: APR
  }
}

interface AssetHistoryItem {
  token: string

  prices: {
    history: PriceHistoryItem[]
  }
}

interface AssetData extends AssetDataItem {
  prices: {
    price: string
    priceAt: string
    oraclePrice: string
    history: PriceHistoryItem[]
  }
}

interface PriceHistoryItem {
  timestamp: number
  price: string
}

interface APR {
  long: string
  short: string
}

/* cdp */
interface CDP {
  address: string
  collateralAmount: string
  collateralRatio: string
  collateralToken: string
  id: string
  mintAmount: string
  token: string
}
