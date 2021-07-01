interface ResultParserItem {
  valueKey?: string
  tokenKey?: string
  amountKey?: string
  symbolKey?: string
  symbol?: string
}

interface ReceiptRow {
  title: string
  content?: string
  children?: { title: string; content: string }[]
}

type ResultParser = (logs: TxLog[], txInfo: TxInfo) => ReceiptRow[]
