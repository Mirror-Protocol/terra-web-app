interface Coin {
  amount: string
  denom: string
}

interface Asset {
  amount: string
  symbol: string
}

interface ListedItem {
  symbol: string
  name: string
  token: string
  pair: string
  lpToken: string
}

interface ListedSwapItem {
  owner: string
  contract_addr: string
  lpToken: string
  asset_infos: []
}

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
