interface Dashboard {
  assetMarketCap: string
  totalValueLocked: string
  collateralRatio: string
  mirCirculatingSupply: string

  latest24h: {
    transactions: string
    volume: string
    volumeChanged: string
    feeVolume: string
    mirVolume: string
    govAPR: string
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
  statistic: {
    volume24h: string
    apr: string
  }
}

interface AssetStats {
  volume: Dict<string | undefined>
  apr: Dict<string | undefined>
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
