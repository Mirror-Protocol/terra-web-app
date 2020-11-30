import { Coins, Extension, SyncTxBroadcastResult } from "@terra-money/terra.js"
import { CreateTxOptions, StdFee } from "@terra-money/terra.js"
import { ceil, plus, times } from "../libs/math"

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

  connect: (callback: (params: { address: string }) => void) => {
    ext.connect()
    ext.on("onConnect", callback)
  },

  post: (
    options: CreateTxOptions,
    txFee: { gasPrice: number; amount: number; tax?: string },
    callback: (params: PostResponse) => void
  ) => {
    const { gasPrice, amount, tax } = txFee
    const gas = Math.floor(amount / gasPrice)
    const feeAmount = ceil(times(gas, gasPrice))

    const id = ext.post({
      ...options,
      gasPrices: new Coins({ uusd: gasPrice }),
      fee: new StdFee(gas, { uusd: plus(feeAmount, tax) }),
      purgeQueue: true,
    })

    ext.on("onPost", callback)
    return id
  },
}
