interface ReceiptRow {
  title: string
  content?: string
  children?: { title: string; content: string }[]
}

type ResultParser = (logs: TxLog[], txInfo: TxInfo) => ReceiptRow[]

interface FromContract extends Dictionary {
  contract_address?: string
  amount?: string
}
