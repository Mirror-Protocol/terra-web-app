import { useAddress, useNetwork } from "hooks"
import {
  UAUD as VAUD,
  UCAD,
  UCHF,
  UCNY,
  UEUR,
  UGBP,
  UHKD,
  UINR,
  UJPY,
  UKRW,
  ULUNA,
  UMNT,
  USDR,
  USGD,
  UTHB,
  UUSD,
} from "constants/constants"
import { useCallback } from "react"
import useURL from "graphql/useURL"
import terraswapConfig from "constants/terraswap.json"
import axios from "./request"
import { Type } from "pages/Swap"
import { Msg } from "@terra-money/terra.js"
import { AxiosError } from "axios"
import { useContractsAddress } from "hooks/useContractsAddress"
interface DenomBalanceResponse {
  height: string
  result: DenomInfo[]
}

interface DenomInfo {
  denom: string
  amount: string
}

interface ContractBalanceResponse {
  height: string
  result: ContractBalance
}

interface ContractBalance {
  balance: string
}

interface GasPriceResponse {
  uluna: string
  uusd: string
  usdr: string
  ukrw: string
  umnt: string
  uaud: string
  ucad: string
  uchf: string
  ucny: string
  ueur: string
  ugbp: string
  uhkd: string
  uinr: string
  ujpy: string
  usgd: string
  uthb: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Pairs {
  pairs: Pair[]
}

export interface Pair {
  pair: TokenInfo[]
  contract: string
  liquidity_token: string
}

interface TokenInfo {
  symbol: string
  name: string
  contract_addr: string
}

interface PairsResponse {
  height: string
  result: PairsResult
}

interface PairsResult {
  pairs: PairResult[]
}

interface PairResult {
  liquidity_token: string
  contract_addr: string
  asset_infos: (NativeInfo | AssetInfo)[]
}

interface TokenResult {
  name: string
  symbol: string
  decimals: number
  total_supply: string
  contract_addr: string
  icon: string
  verified: boolean
}

interface PoolResponse {
  height: string
  result: Pool
}

interface Pool {
  assets: Token[]
  total_share: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PoolResult {
  estimated: string
  price1: string
  price2: string
  afterPool: string
  LP: string
  // fromLP: Asset[]
  // text: string
}

interface SimulatedResponse {
  height: string
  result: SimulatedData
}
interface SimulatedData {
  return_amount: string
  offer_amount: string
  commission_amount: string
  spread_amount: string
}
interface TaxResponse {
  height: string
  result: string
}

const blacklist = terraswapConfig.blacklist.map(
  (blacklist) => blacklist.contract_addr
)

const isBlacklisted = (info: NativeInfo | AssetInfo) => {
  if (!isAssetInfo(info) || !blacklist.includes(info.token.contract_addr)) {
    return false
  }

  return true
}

export function isAssetInfo(object: any): object is AssetInfo {
  return "token" in object
}

export function isNativeInfo(object: any): object is NativeInfo {
  return "native_token" in object
}

const useAPI = () => {
  const { fcd, factory, service } = useNetwork()
  const address = useAddress()
  const { getSymbol } = useContractsAddress()
  const getURL = useURL()

  // useBalance
  const loadDenomBalance = useCallback(async () => {
    const url = `${fcd}/bank/balances/${address}`
    const res: DenomBalanceResponse = (await axios.get(url)).data
    return res.result
  }, [address, fcd])

  const loadContractBalance = useCallback(
    async (localContractAddr: string) => {
      const url = getURL(localContractAddr, { balance: { address: address } })
      const res: ContractBalanceResponse = (await axios.get(url)).data
      return res.result
    },
    [address, getURL]
  )

  // useGasPrice

  const loadGasPrice = useCallback(
    async (symbol: string) => {
      const symbolName = getSymbol(symbol) || symbol
      const url = `${fcd}/v1/txs/gas_prices`
      const res: GasPriceResponse = (await axios.get(url)).data

      let gasPrice = "0"
      if (
        [
          UUSD,
          UKRW,
          UMNT,
          ULUNA,
          USDR,
          VAUD,
          UCAD,
          UCHF,
          UCNY,
          UEUR,
          UGBP,
          UHKD,
          UINR,
          UJPY,
          USGD,
          UTHB,
        ].includes(symbolName)
      ) {
        gasPrice = (res as any)?.[symbolName]
      }

      return gasPrice
    },
    [fcd, getSymbol]
  )

  // usePairs
  const loadPairs = useCallback(async () => {
    let result: PairsResult = {
      pairs: [],
    }
    let lastPair: (NativeInfo | AssetInfo)[] | null = null

    try {
      const url = `${service}/pairs`
      const res: PairsResult = (await axios.get(url)).data

      if (res.pairs.length !== 0) {
        res.pairs
          .filter(
            (pair) =>
              !isBlacklisted(pair?.asset_infos?.[0]) &&
              !isBlacklisted(pair?.asset_infos?.[1])
          )
          .forEach((pair) => {
            result.pairs.push(pair)
          })

        return result
      }
    } catch (error) {
      console.error(error)
    }

    while (true) {
      const url = getURL(factory, {
        pairs: { limit: 30, start_after: lastPair },
      })
      const pairs: PairsResponse = (await axios.get(url)).data

      if (!Array.isArray(pairs?.result?.pairs)) {
        // node might be down
        break
      }

      if (pairs.result.pairs.length <= 0) {
        break
      }

      pairs.result.pairs
        .filter(
          (pair) =>
            !isBlacklisted(pair?.asset_infos?.[0]) &&
            !isBlacklisted(pair?.asset_infos?.[1])
        )
        .forEach((pair) => {
          result.pairs.push(pair)
        })
      lastPair = pairs.result.pairs.slice(-1)[0]?.asset_infos
    }
    return result
  }, [service, factory, getURL])

  const loadTokensInfo = useCallback(async (): Promise<TokenResult[]> => {
    const url = `${service}/tokens`
    const res: TokenResult[] = (await axios.get(url)).data
    return res
  }, [service])

  const loadSwappableTokenAddresses = useCallback(
    async (from: string) => {
      const res: string[] = (
        await axios.get(`${service}/tokens/swap`, { params: { from } })
      ).data
      return res
    },
    [service]
  )

  const loadTokenInfo = useCallback(
    async (contract: string): Promise<TokenResult> => {
      const url = getURL(contract, { token_info: {} })
      const res = (await axios.get(url)).data
      return res.result
    },
    [getURL]
  )

  // usePool
  const loadPool = useCallback(
    async (contract: string) => {
      const url = getURL(contract, { pool: {} })
      const res: PoolResponse = (await axios.get(url)).data
      return res.result
    },
    [getURL]
  )

  // useSwapSimulate
  const querySimulate = useCallback(
    async (variables: { contract: string; msg: any }) => {
      try {
        const { contract, msg } = variables
        const url = getURL(contract, msg)
        const res: SimulatedResponse = (await axios.get(url)).data
        return res
      } catch (error) {
        const { response }: AxiosError = error as any
        return response?.data
      }
    },
    [getURL]
  )

  const generateContractMessages = useCallback(
    async (
      query:
        | {
            type: Type.SWAP
            from: string
            to: string
            amount: number | string
            max_spread: number | string
            belief_price: number | string
            sender: string
          }
        | {
            type: Type.PROVIDE
            from: string
            to: string
            fromAmount: number | string
            toAmount: number | string
            slippage: number | string
            sender: string
          }
        | {
            type: Type.WITHDRAW
            lpAddr: string
            amount: number | string
            sender: string
          }
    ) => {
      const { type, ...params } = query
      const url = `${service}/tx/${type}`.toLowerCase()
      const res = (await axios.get(url, { params })).data
      return res.map((data: Msg.Amino | Msg.Amino[]) => {
        return (Array.isArray(data) ? data : [data]).map((item: Msg.Amino) => {
          const result = Msg.fromAmino(item, true)
          return result
        })
      })
    },
    [service]
  )

  // useTax
  const loadTaxInfo = useCallback(
    async (contract_addr: string) => {
      if (!contract_addr) {
        return ""
      }

      let taxCap = ""
      try {
        const url = `${fcd}/treasury/tax_cap/${contract_addr}`
        const res: TaxResponse = (await axios.get(url)).data
        taxCap = res.result
      } catch (error) {
        console.error(error)
      }

      return taxCap
    },
    [fcd]
  )

  const loadTaxRate = useCallback(async () => {
    const url = `${fcd}/treasury/tax_rate`
    const res: TaxResponse = (await axios.get(url)).data
    return res.result
  }, [fcd])

  return {
    loadDenomBalance,
    loadContractBalance,
    loadGasPrice,
    loadPairs,
    loadTokensInfo,
    loadSwappableTokenAddresses,
    loadTokenInfo,
    loadPool,
    querySimulate,
    generateContractMessages,
    loadTaxInfo,
    loadTaxRate,
  }
}

export default useAPI
