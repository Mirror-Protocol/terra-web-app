import {
  Coin,
  Coins,
  Extension,
  SyncTxBroadcastResult,
} from "@terra-money/terra.js"
import { CreateTxOptions, StdFee } from "@terra-money/terra.js"
import { UKRW, ULUNA, UMNT, USDR, UUSD } from "constants/constants"
import { ceil } from "libs/math"

export type Result = SyncTxBroadcastResult.Data
export interface PostResponse {
  id: number
  origin: string
  success: boolean
  result?: Result
  error?: { code: number; message?: string }
}

const ext = new Extension()
export default {
  init: () => !!ext.isAvailable,

  info: (callback: (network?: ExtNetworkConfig) => void) => {
    ext.info()
    ext.on("onInfo", callback)
  },

  connect: (callback: (address: string) => void) => {
    ext.connect()
    ext.on("onConnect", ({ address }: { address: string }) => callback(address))
  },

  post: (
    options: CreateTxOptions,
    txFee: {
      gasPrice: string
      amount: string
      tax: string
      symbol: string
      gas: string
    },
    callback: (params: PostResponse) => void
  ) => {
    const { gasPrice, amount, symbol, gas } = txFee

    const feeCoins = new Coins({})
    feeCoins.set(symbol, ceil(amount))
    const taxs = txFee.tax.split(",")
    for (let i = 0; i < taxs.length; i++) {
      if (taxs[i] === "0") {
        break
      }
      const taxCoin = Coin.fromString(taxs[i])
      const feeCoin = feeCoins.get(taxCoin.denom)
      if (feeCoin === undefined) {
        feeCoins.set(taxCoin.denom, taxCoin.amount)
      } else {
        feeCoins.set(taxCoin.denom, feeCoin.amount.add(taxCoin.amount))
      }
    }

    const id = ext.post({
      ...options,
      gasPrices: new Coins(formateGasPrice(symbol, gasPrice)),
      fee: new StdFee(parseInt(gas), feeCoins),
      purgeQueue: true,
    })
    ext.on("onPost", callback)
    return id
  },
}

function formateGasPrice(symbol: string, gasPrice: string) {
  let res = {}
  switch (symbol) {
    case ULUNA:
      res = { uluna: gasPrice }
      break
    case UKRW:
      res = { ukrw: gasPrice }
      break
    case UMNT:
      res = { umnt: gasPrice }
      break
    case USDR:
      res = { usdr: gasPrice }
      break
    case UUSD:
      res = { uusd: gasPrice }
      break
  }

  return res
}
