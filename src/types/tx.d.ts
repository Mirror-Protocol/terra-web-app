interface TxInfo {
  Logs: TxLog[]
}

interface TxLog {
  Events: TxEvent[]
}

interface TxEvent {
  Attributes: Attribute[]
  Type: string
}

interface Attribute {
  Key: string
  Value: string
}

/* Tax */
interface TaxData {
  TreasuryTaxCapDenom: {
    Result: string
  }
  TreasuryTaxRate: {
    Result: string
  }
}

interface Tax {
  rate?: string
  cap?: string
}
