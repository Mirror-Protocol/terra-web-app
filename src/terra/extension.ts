import { Extension, SyncTxBroadcastResult } from "@terra-money/terra.js"
import { CreateTxOptions, LCDClientConfig } from "@terra-money/terra.js"
import { GAS_PRICE } from "../constants"

export type Result = SyncTxBroadcastResult.Data
export interface PostResponse {
  id: number
  origin: string
  success: boolean
  result?: Result
  error?: { code: number; message?: string }
}

interface Options extends CreateTxOptions {
  lcdClientConfig: LCDClientConfig
}

const ext = new Extension()
export default {
  init: () => !!ext.isAvailable,

  connect: (callback: (address: string) => void) => {
    ext.connect()
    ext.on("onConnect", ({ address }: { address: string }) => callback(address))
  },

  post: (options: Options, callback: (params: PostResponse) => void) => {
    const lcdClientConfig = {
      ...options.lcdClientConfig,
      gasPrices: { uusd: GAS_PRICE },
    }

    const id = ext.post({ ...options, purgeQueue: true, lcdClientConfig })
    ext.on("onPost", callback)
    return id
  },
}
