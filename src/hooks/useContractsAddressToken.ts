import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import { UUSD } from "constants/constants"
import createContext from "./createContext"
import { useNetwork } from "./useNetwork"

interface ContractAddressTokenJSON {
  /** Contract addresses */
  contracts: Dictionary<string>
  /** Token addresses */
  whitelist: Dictionary<ListedItem>
}

interface ContractAddressTokenHelpers {
  /** Array of listed item */
  listed: ListedItem[]
  /** Find contract address with any key */
  getListedItem: (key?: string) => ListedItem
  getSymbol: (key?: string) => string
  /** Convert structure for chain */
  toAssetInfo: (symbol: string) => AssetInfo | NativeInfo
  toToken: (params: Asset) => Token
  /** Convert from token of structure for chain */
  parseAssetInfo: (info: AssetInfo | NativeInfo) => string
  parseToken: (token: AssetToken | NativeToken) => Asset
}

export type ContractsAddressToken = ContractAddressTokenJSON &
  ContractAddressTokenHelpers
const context = createContext<ContractsAddressToken>("useContractsAddressToken")
export const [useContractsAddressToken, ContractsAddressTokenProvider] = context

/* state */
export const useContractsAddressTokenState = ():
  | ContractsAddressToken
  | undefined => {
  const { contract: url } = useNetwork()
  const [data, setData] = useState<ContractAddressTokenJSON>()

  useEffect(() => {
    const load = async () => {
      const response = await fetch(url)
      const json: ContractAddressTokenJSON = await response.json()
      setData(json)
    }

    load()
  }, [url])

  const helpers = ({
    whitelist,
  }: ContractAddressTokenJSON): ContractAddressTokenHelpers => {
    const listed = Object.values(whitelist)

    const getListedItem = (key?: string) =>
      listed.find((item) => Object.values(item).includes(key)) ?? {
        symbol: "",
        name: "",
        token: "",
        pair: "",
        lpToken: "",
      }

    const getSymbol = (key?: string) =>
      key === UUSD ? key : getListedItem(key).symbol

    const toAssetInfo = (symbol: string) =>
      symbol === UUSD
        ? { native_token: { denom: symbol } }
        : { token: { contract_addr: getListedItem(symbol)["token"] } }

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
      getSymbol,
      toAssetInfo,
      toToken,
      parseAssetInfo,
      parseToken,
    }
  }

  return data && { ...data, ...helpers(data) }
}
