interface SwapTxInfos {
  TxInfos: SwapTxInfo[]
}

interface SwapTxInfo {
  txhash: string

  tx: {
    value: {
      fee: { amount: FeeAmount[] }
      memo: string
    }
  }

  raw_log?: string

  logs: SwapTxLog[]
}

interface FeeAmount {
  amount: string
  denom: string
}

interface SwapTxLog {
  events: SwapTxEvent[]
}

interface SwapTxEvent {
  attributes: SwapAttribute[]
  type: string
}

interface SwapAttribute {
  key: string
  value: string
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
