interface Dashboard {
  assetMarketCap: string
  totalValueLocked: string
  collateralRatio: string
  mirCirculatingSupply: string
  govAPR: string
  govAPY: string

  latest24h: {
    transactions: string
    volume: string
    feeVolume: string
    mirVolume: string
  }

  liquidityHistory: ChartItem[]
  tradingVolumeHistory: ChartItem[]
}

interface ChartItem {
  timestamp: number
  value: string
}

/* asset */
interface AssetStatsData {
  token: string
  description?: string
  statistic: {
    liquidity: string
    volume: string
    apr: string
    apy: string
  }
}

interface AssetStats {
  description: Dict<string | undefined>
  liquidity: Dict<string | undefined>
  volume: Dict<string | undefined>
  apr: Dict<string | undefined>
  apy: Dict<string | undefined>
}

/* price */
interface YesterdayData {
  [token: string]: {
    prices: {
      priceAt: string | null
      oraclePriceAt: string | null
    }
  }
}

interface Yesterday {
  pair: Dict<string | undefined>
  oracle: Dict<string | undefined>
}
