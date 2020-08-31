import { Extension, SyncTxBroadcastResult } from "@terra-money/terra.js"
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

class ExtensionSingleton {
  get init() {
    return !!ext.isAvailable
  }

  async info(): Promise<ExtNetworkConfig> {
    const res = await ext.request("info")
    return res.payload as any
  }

  async connect(): Promise<{ address: string }> {
    const res = await ext.request("connect")
    return res.payload as any
  }

  async post(
    options: CreateTxOptions,
    txFee: { gasPrice: number; amount: number; tax?: string }
  ): Promise<PostResponse> {
    const { gasPrice, amount, tax } = txFee
    const gas = Math.floor(amount / gasPrice)
    const feeAmount = ceil(times(gas, gasPrice))
    const res = await ext.request("post", {
      msgs: options.msgs.map((msg) => msg.toJSON()),
      memo: options.memo,
      gasPrices: `${gasPrice}uusd`,
      fee: new StdFee(gas, { uusd: plus(feeAmount, tax) }).toJSON(),
      purgeQueue: true,
    })

    return res.payload as any
  }
}

export default new ExtensionSingleton()
