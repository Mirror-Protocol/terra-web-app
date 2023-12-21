import axios from "./request"
import { useNetwork } from "hooks"
import { useMemo } from "react"

interface Token {
  tokenAddress: string
  symbol: string
  price: string
}

interface Volume24h {
  volumeUST: string
  token0Volume: string
  token1Volume: string
}

interface Volume {
  volume: string
  timestamp: Date
}

interface Liquidity {
  liquidity: string
  timestamp: Date
}

export interface Pair {
  timestamp: Date
  pairAddress: string
  token0: string
  token0Volume: string
  token0Reserve: string
  token1: string
  token1Volume: string
  token1Reserve: string
  totalLpTokenShare: string
  volumeUst: string // Deprecated
  liquidityUst: string
  token0Symbol: string
  token0Decimals: number
  token1Symbol: string
  token1Decimals: number
  dailyVolumeUst?: string
  apr: string
  pairAlias: string
}

export interface PairDetail {
  token0: Token
  token1: Token
  volume24h: Volume24h
  volumes: Volume[]
  liquidities: Liquidity[]
  lpTokenAddress: string
  pairAddress: string
  token0Reserve: string
  token1Reserve: string
}

export interface Recent {
  volume: string
  volumeIncreasedRate: string
  liquidity: string
  liquidityIncreasedRate: string
  fee: string
  feeIncreasedRate: string
  timestamp: Date
  height: number
}

export interface Transaction {
  ID: number
  timestamp: Date
  txHash: string
  pairAddress: string
  action: "swap" | "provide_liquidity" | "withdraw_liquidity"
  token0Amount: string
  token1Amount: string
}

const useDashboardAPI = () => {
  const { dashboard: dashboardBaseUrl } = useNetwork()

  const api = useMemo(() => {
    return {
      terraswap: {
        async getChartData(params: {
          unit: "day" | "month" | "year"
          from: string
          to: string
        }) {
          const res = await axios.get<
            { timestamp: Date; volumeUst: string; liquidityUst: string }[]
          >(`${dashboardBaseUrl}/terraswap`, { params })
          if (Array.isArray(res?.data)) {
            return res.data
          }
          throw Error("no data")
        },
        async getRecent() {
          const res = await axios.get<{ daily: Recent; weekly: Recent }>(
            `${dashboardBaseUrl}/terraswap/recent`
          )
          if (res.data?.daily) {
            return res.data
          }
          throw Error("no data")
        },
      },
      pairs: {
        async list() {
          const res = await axios.get<Pair[]>(`${dashboardBaseUrl}/pairs`)
          if (Array.isArray(res?.data)) {
            return res.data
          }
          throw Error("no data")
        },
        async findOne(address: string) {
          const res = await axios.get<PairDetail>(
            `${dashboardBaseUrl}/pairs/${address}`
          )
          if (res?.data) {
            return res.data
          }
          throw Error("no data")
        },
        async getRecent(address: string) {
          const res = await axios.get<{ daily: Recent; weekly: Recent }>(
            `${dashboardBaseUrl}/pairs/${address}/recent`
          )
          if (res.data?.daily) {
            return res.data
          }
          throw Error("no data")
        },
      },
      txs: {
        async list({
          page,
          pairAddress: pair,
        }: {
          page: number
          pairAddress: string
        }) {
          const params = { page, pair }
          const res = await axios.get<{
            txs: Transaction[]
            totalCount: number
          }>(`${dashboardBaseUrl}/txs`, { params })
          if (Array.isArray(res?.data?.txs)) {
            return res.data
          }
          throw Error("no data")
        },
      },
    }
  }, [dashboardBaseUrl])

  return { api }
}

export default useDashboardAPI
