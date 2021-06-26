import { useCallback, useEffect, useState } from "react"
import {
  KRT,
  LUNA,
  MNT,
  SDT,
  UKRW,
  ULUNA,
  UMNT,
  UST,
  UUSD,
  USDR,
  AUT,
  CAT,
  CHT,
  CNT,
  EUT,
  GBT,
  HKT,
  INT,
  JPT,
  SGT,
  THT,
  UAUD,
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
} from "constants/constants"
import useAPI from "./useAPI"
import { useNetwork } from "hooks"
import mainnetTokens from "constants/mainnet-tokens.json"
import testnetTokens from "constants/testnet-tokens.json"

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
}

export let tokenInfos: Map<string, TokenInfo> = new Map<string, TokenInfo>([
  [LUNA, { contract_addr: ULUNA, symbol: LUNA, name: ULUNA }],
  [KRT, { contract_addr: UKRW, symbol: KRT, name: UKRW }],
  [MNT, { contract_addr: UMNT, symbol: MNT, name: UMNT }],
  [SDT, { contract_addr: USDR, symbol: SDT, name: USDR }],
  [UST, { contract_addr: UUSD, symbol: UST, name: UUSD }],
  [AUT, { contract_addr: UAUD, symbol: AUT, name: UAUD }],
  [CAT, { contract_addr: UCAD, symbol: CAT, name: UCAD }],
  [CHT, { contract_addr: UCHF, symbol: CHT, name: UCHF }],
  [CNT, { contract_addr: UCNY, symbol: CNT, name: UCNY }],
  [EUT, { contract_addr: UEUR, symbol: EUT, name: UEUR }],
  [GBT, { contract_addr: UGBP, symbol: GBT, name: UGBP }],
  [HKT, { contract_addr: UHKD, symbol: HKT, name: UHKD }],
  [INT, { contract_addr: UINR, symbol: INT, name: UINR }],
  [JPT, { contract_addr: UJPY, symbol: JPT, name: UJPY }],
  [SGT, { contract_addr: USGD, symbol: SGT, name: USGD }],
  [THT, { contract_addr: UTHB, symbol: THT, name: UTHB }],
  [ULUNA, { contract_addr: ULUNA, symbol: LUNA, name: ULUNA }],
  [UKRW, { contract_addr: UKRW, symbol: KRT, name: UKRW }],
  [UMNT, { contract_addr: UMNT, symbol: MNT, name: UMNT }],
  [USDR, { contract_addr: USDR, symbol: SDT, name: USDR }],
  [UUSD, { contract_addr: UUSD, symbol: UST, name: UUSD }],
  [UAUD, { contract_addr: UAUD, symbol: AUT, name: UAUD }],
  [UCAD, { contract_addr: UCAD, symbol: CAT, name: UCAD }],
  [UCHF, { contract_addr: UCHF, symbol: CHT, name: UCHF }],
  [UCNY, { contract_addr: UCNY, symbol: CNT, name: UCNY }],
  [UEUR, { contract_addr: UEUR, symbol: EUT, name: UEUR }],
  [UGBP, { contract_addr: UGBP, symbol: GBT, name: UGBP }],
  [UHKD, { contract_addr: UHKD, symbol: HKT, name: UHKD }],
  [UINR, { contract_addr: UINR, symbol: INT, name: UINR }],
  [UJPY, { contract_addr: UJPY, symbol: JPT, name: UJPY }],
  [USGD, { contract_addr: USGD, symbol: SGT, name: USGD }],
  [UTHB, { contract_addr: UTHB, symbol: THT, name: UTHB }],
])

export let lpTokenInfos: Map<string, TokenInfo[]> = new Map<
  string,
  TokenInfo[]
>()

export let InitLP = ""

export default () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Pairs>({ pairs: [] })
  const { loadPairs, loadTokenInfo, loadTokensInfo } = useAPI()
  const { name } = useNetwork()

  const getTokenInfo = useCallback(
    async (info: NativeInfo | AssetInfo) => {
      let tokenInfo: TokenInfo | undefined
      if (isAssetInfo(info)) {
        tokenInfo = tokenInfos.get(info.token.contract_addr)
        if (!tokenInfo) {
          const tokenResult: TokenResult | undefined = await loadTokenInfo(
            info.token.contract_addr
          )
          tokenInfo = {
            symbol: "",
            name: "",
            contract_addr: info.token.contract_addr,
          }
          if (tokenResult) {
            tokenInfo = {
              symbol: tokenResult.symbol,
              name: tokenResult.name,
              contract_addr: info.token.contract_addr,
            }
          }
          tokenInfos.set(info.token.contract_addr, tokenInfo)
        }
      } else if (isNativeInfo(info)) {
        tokenInfo = tokenInfos.get(info.native_token.denom)
      }

      return tokenInfo
    },
    [loadTokenInfo]
  )

  useEffect(() => {
    try {
      if (isLoading || result?.pairs.length > 0) {
        return
      }
      setIsLoading(true)

      const fetchTokensInfo = async () => {
        try {
          const res = await loadTokensInfo()
          res.forEach((tokenInfo: TokenResult) => {
            tokenInfos.set(tokenInfo.contract_addr, tokenInfo)
          })
        } catch (error) {
          console.log(error)
        }

        (name === "testnet" ? testnetTokens : mainnetTokens).forEach(
          (token) => {
            if (
              token !== undefined &&
              token.symbol &&
              !tokenInfos.has(token.contract_addr)
            ) {
              tokenInfos.set(token.contract_addr, {
                contract_addr: token.contract_addr,
                symbol: token.symbol,
                name: token.name,
              })
            }
          }
        )
      }

      const fetchPairs = async () => {
        const res: PairsResult = await loadPairs()
        const pairs = await Promise.all(
          res.pairs.map(async (pairResult: PairResult) => {
            try {
              const tokenInfo1 = await getTokenInfo(pairResult.asset_infos[0])
              const tokenInfo2 = await getTokenInfo(pairResult.asset_infos[1])
              if (tokenInfo1 === undefined || tokenInfo2 === undefined) {
                return
              }

              if (
                tokenInfo1?.symbol?.toUpperCase() === "BLUNA" ||
                tokenInfo2?.symbol?.toUpperCase() === "BLUNA" ||
                tokenInfo1?.symbol?.toUpperCase() === "ANC" ||
                tokenInfo2?.symbol?.toUpperCase() === "ANC"
              ) {
                if (
                  !(
                    tokenInfo1?.contract_addr ===
                      "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp" ||
                    tokenInfo1?.contract_addr ===
                      "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76"
                  )
                ) {
                  return
                }

                if (tokenInfo1?.symbol === "BLUNA") {
                  tokenInfo1.symbol = "bLUNA"
                }
                if (tokenInfo2?.symbol === "BLUNA") {
                  tokenInfo2.symbol = "bLUNA"
                }
              }

              if (name === "mainnet" && tokenInfo1?.symbol === "MINE" && !(tokenInfo1?.contract_addr === "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy")) {
                return
              }

              if (name === "mainnet" && tokenInfo2?.symbol === "MINE" && !(tokenInfo2?.contract_addr === "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy")) {
                return
              }

              const lpTokenInfo = await getTokenInfo({
                token: { contract_addr: pairResult.liquidity_token },
              })

              lpTokenInfos.set(pairResult.liquidity_token, [
                tokenInfo1,
                tokenInfo2,
              ])
              if (
                (tokenInfo1.symbol === LUNA && tokenInfo2.symbol === UST) ||
                (tokenInfo1.symbol === UST && tokenInfo2.symbol === LUNA)
              ) {
                InitLP = pairResult.liquidity_token
              }

              lpTokenInfo &&
                tokenInfos.set(pairResult.liquidity_token, {
                  contract_addr: pairResult.liquidity_token,
                  name: lpTokenInfo.name,
                  symbol: lpTokenInfo.symbol,
                })

              let pair: Pair = {
                contract: pairResult.contract_addr,
                pair: [tokenInfo1, tokenInfo2],
                liquidity_token: pairResult.liquidity_token,
              }

              return pair
            } catch (error) {
              console.log(error)
            }
            return undefined
          })
        )

        if (pairs) {
          setResult({
            pairs: pairs.filter((pair) => !!pair) as Pair[],
          })
          setIsLoading(false)
        }
      }

      fetchTokensInfo().then(() => fetchPairs())
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }, [getTokenInfo, isLoading, loadPairs, loadTokensInfo, name, result])

  return { ...result, isLoading }
}

export function isAssetInfo(object: any): object is AssetInfo {
  return "token" in object
}

export function isNativeInfo(object: any): object is NativeInfo {
  return "native_token" in object
}
