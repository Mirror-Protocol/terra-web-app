import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import { UUSD } from "../constants"
import createContext from "./createContext"
import useNetwork from "./useNetwork"

interface ContractAddressJSON {
  /** Contract addresses */
  contracts: Dictionary<string>
  /** Token addresses */
  whitelist: Dictionary<ListedItem>
}

interface ContractAddressHelpers {
  /** Array of listed item */
  listed: ListedItem[]
  listedAll: ListedItem[]
  /** Find token with symbol */
  getToken: (symbol?: string) => string
  /** Find symbol with token */
  getSymbol: (token?: string) => string
  /** Convert structure for chain */
  toAssetInfo: (token: string) => AssetInfo | NativeInfo
  toToken: (params: Asset) => Token
  /** Convert from token of structure for chain */
  parseToken: (token: AssetToken | NativeToken) => Asset
}

export type ContractsAddress = ContractAddressJSON & ContractAddressHelpers
const context = createContext<ContractsAddress>("useContractsAddress")
export const [useContractsAddress, ContractsAddressProvider] = context

/* state */
export const useContractsAddressState = (): ContractsAddress | undefined => {
  const { contract: url } = useNetwork()
  const [data, setData] = useState<ContractAddressJSON>()

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(url)
        const json: ContractAddressJSON = await response.json()
        setData(json)
      } catch {
        setData({ contracts: {}, whitelist: {} })
      }
    }

    url && load()
  }, [url])

  const helpers = ({
    whitelist,
  }: ContractAddressJSON): ContractAddressHelpers => {
    const listedAll = Object.values(whitelist)
    const listed = listedAll.filter(({ status }) => status === "LISTED")

    const getToken = (symbol?: string) =>
      !symbol
        ? ""
        : symbol === UUSD
        ? symbol
        : listed.find((item) => item.symbol === symbol)?.["token"] ?? ""

    const getSymbol = (token?: string) =>
      !token
        ? ""
        : token.startsWith("u")
        ? token
        : whitelist[token]?.["symbol"] ?? ""

    const toAssetInfo = (token: string) =>
      token === UUSD
        ? { native_token: { denom: token } }
        : { token: { contract_addr: token } }

    const toToken = ({ amount, token }: Asset) => ({
      amount,
      info: toAssetInfo(token),
    })

    const parseAssetInfo = (info: AssetInfo | NativeInfo) => {
      const token =
        "native_token" in info
          ? info.native_token.denom
          : info.token.contract_addr

      return { token, symbol: getSymbol(token) }
    }

    const parseToken = ({ amount, info }: AssetToken | NativeToken) => ({
      amount,
      ...parseAssetInfo(info),
    })

    return {
      listed,
      listedAll,
      getToken,
      getSymbol,
      toAssetInfo,
      toToken,
      parseToken,
    }
  }

  return data && { ...data, ...helpers(data) }
}
