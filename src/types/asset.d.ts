interface Coin {
  amount: string
  denom: string
}

interface Asset {
  amount: string
  token: string
  symbol?: string
}

interface ListedItem {
  symbol: string
  name: string
  token: string
  pair: string
  lpToken: string
  status: ListedItemStatus
}

interface DelistItem {
  symbol: string
  date: string
  ratio: string
}

type ListedItemStatus = "LISTED" | "DELISTED"

/* chain */
interface AssetInfo {
  token: { contract_addr: string }
}

interface NativeInfo {
  native_token: { denom: string }
}

interface AssetToken {
  amount: string
  info: AssetInfo
}

interface NativeToken {
  amount: string
  info: NativeInfo
}

interface Token {
  amount: string
  info: AssetInfo | NativeInfo
}
