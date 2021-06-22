interface Dashboard {
  assetMarketCap: string
  govAPR: string
  mirPrice: string
  mirSupply: MIRSupply
  totalValueLocked: TVL
  latest24h: Latest24h
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

interface Lastest24h {
  transactions: string
  volume: string
  feeVolume: string
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
    volume: string
    marketCap: string
    collateralValue: string
    minCollateralRatio: string
    apr: APR
  }
}

interface AssetHistoryItem {
  token: string

  prices: {
    history: PriceHistoryItem[]
  }
}

interface AssetHistoryData {
  prices: {
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
