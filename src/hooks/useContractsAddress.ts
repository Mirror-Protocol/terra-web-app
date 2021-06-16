import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import createContext from "./createContext"
import { useNetwork } from "./useNetwork"
import { NATIVE_TOKENS } from "constants/constants"
import { getSymbol } from "helpers/token"

interface ContractAddressJSON {
  /** Contract addresses */
  contracts: Dictionary<string>
  /** Token addresses */
  whitelist: Dictionary<ListedItem>
}

interface ContractAddressHelpers {
  /** Array of listed item */
  listed: ListedItem[]
  /** Find contract address with any key */
  getListedItem: (key?: string) => ListedItem
  // getSymbol: (key?: string) => string
  getSymbol: (key: string) => string
  isNativeToken: (key: string) => boolean
  /** Convert structure for chain */
  toAssetInfo: (symbol: string) => AssetInfo | NativeInfo
  toToken: (params: Asset) => Token
  /** Convert from token of structure for chain */
  parseAssetInfo: (info: AssetInfo | NativeInfo) => string
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
      const response = await fetch(url)
      const json: ContractAddressJSON = await response.json()
      setData(json)
    }

    load()
  }, [url])

  const helpers = ({
    whitelist,
  }: ContractAddressJSON): ContractAddressHelpers => {
    const listed = Object.values(whitelist)

    const getListedItem = (key?: string) =>
      listed.find((item) => Object.values(item).includes(key)) ?? {
        symbol: "",
        name: "",
        token: "",
        pair: "",
        lpToken: "",
      }

    const isNativeToken = (key: string) =>
      NATIVE_TOKENS.indexOf(key) > -1 ? true : false

    const toAssetInfo = (key: string) =>
      NATIVE_TOKENS.indexOf(key) > -1
        ? { native_token: { denom: key } }
        : { token: { contract_addr: key } }

    const toToken = ({ amount, symbol }: Asset) => ({
      amount,
      info: toAssetInfo(symbol),
    })

    const parseAssetInfo = (info: AssetInfo | NativeInfo) =>
      "native_token" in info
        ? info.native_token.denom
        : getSymbol(info.token.contract_addr)

    const parseToken = ({ amount, info }: AssetToken | NativeToken) => ({
      amount,
      symbol: parseAssetInfo(info),
    })

    return {
      listed,
      getListedItem,
      isNativeToken,
      getSymbol,
      toAssetInfo,
      toToken,
      parseAssetInfo,
      parseToken,
    }
  }

  return data && { ...data, ...helpers(data) }
}
