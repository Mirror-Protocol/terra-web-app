interface ReceiptRow {
  title: string
  content?: string
  children?: { title: string; content: string }[]
}

type ResultParser = (logs: TxLog[]) => ReceiptRow[]
