import { Event, TxInfo, TxLog } from "@terra-money/terra.js"

interface FeeAmount {
  amount: string
  denom: string
}

interface SwapAttribute extends EventKV {
  key: string
  value: string
}
interface SwapTxEvent extends Event {
  attributes: SwapAttribute[]
  type: string
}

interface SwapTxLog extends TxLog {
  events: SwapTxEvent[]
}

/* Tax */
interface SwapTaxData {
  TreasuryTaxCapDenom: {
    Result: string
  }
  TreasuryTaxRate: {
    Result: string
  }
}

interface SwapTax {
  rate?: string
  cap?: string
}

interface SwapTxInfo extends TxInfo {
  tx: {
    value: {
      fee: { amount: FeeAmount[] }
      memo: string
    }
  }
  logs: SwapTxLog[]
}
interface SwapTxInfos {
  TxInfos: SwapTxInfo[]
}
