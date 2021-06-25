import { Dictionary, path } from "ramda"
import { format as formatDate } from "date-fns"
import { useProtocol } from "../data/contract/protocol"
import { lookup, lookupSymbol } from "../libs/parse"
import * as helpers from "../forms/receipts/receiptHelpers"

const { parseTokenText, splitTokenText } = helpers
const HEAD = "data:text/csv;charset=utf-8"

interface Column {
  dataIndex: string[]
  title: string
  render?: (value: string, tx: Tx) => string
}

const useDownloadCSV = (txs: Tx[]) => {
  const { getSymbol } = useProtocol()

  const splitLookup = (value: string) => {
    const split = splitTokenText(value)
    return value ? lookup(split.amount, getSymbol(split.token)) : ""
  }

  const parseLookup = (value: string) =>
    parseTokenText(value)
      .map(({ amount, token }) => {
        const symbol = getSymbol(token)
        return [lookup(amount, symbol), lookupSymbol(symbol)].join(" ")
      })
      .join(" + ")

  const renderAmount = (value: string, { data, token }: Tx) => {
    const symbol = lookupSymbol(data.denom ?? data.askAsset) || getSymbol(token)
    return value ? lookup(value, symbol) : ""
  }

  const defaultColumns: Column[] = [
    {
      dataIndex: ["datetime"],
      title: "datetime",
      render: (value) => formatDate(new Date(value), "M/d/yyyy H:mm"),
    },
    {
      dataIndex: ["type"],
      title: "type",
    },
    {
      dataIndex: ["token"],
      title: "ticker",
      render: (value, { data }) => lookupSymbol(getSymbol(value) || data.denom),
    },
  ]

  const data: Dictionary<{ type: string[]; columns: Column[] }> = {
    terra: {
      type: ["TERRA_SWAP", "TERRA_SEND", "TERRA_RECEIVE", "SEND", "RECEIVE"],
      columns: [
        {
          dataIndex: ["data", "amount"],
          title: "amount",
          render: renderAmount,
        },
        {
          dataIndex: ["data", "from"],
          title: "from",
        },
        {
          dataIndex: ["data", "to"],
          title: "to",
        },
        {
          dataIndex: ["data", "offer"],
          title: "offer",
          render: parseLookup,
        },
        {
          dataIndex: ["data", "swapCoin"],
          title: "return",
          render: parseLookup,
        },
      ],
    },
    trade: {
      type: ["BUY", "SELL"],
      columns: [
        {
          dataIndex: ["data", "recvAmount"],
          title: "amount",
          render: renderAmount,
        },
        {
          dataIndex: ["data", "price"],
          title: "price",
        },
        {
          dataIndex: ["data", "commissionAmount"],
          title: "commission",
          render: renderAmount,
        },
      ],
    },
    mint: {
      type: [
        "OPEN_POSITION",
        "DEPOSIT_COLLATERAL",
        "WITHDRAW_COLLATERAL",
        "MINT",
        "BURN",
      ],
      columns: [
        {
          dataIndex: ["data", "collateralAmount"],
          title: "collateral",
          render: splitLookup,
        },
        {
          dataIndex: ["data", "depositAmount"],
          title: "deposit",
          render: splitLookup,
        },
        {
          dataIndex: ["data", "withdrawAmount"],
          title: "withdraw",
          render: splitLookup,
        },
        {
          dataIndex: ["data", "mintAmount"],
          title: "mint",
          render: splitLookup,
        },
        {
          dataIndex: ["data", "burnAmount"],
          title: "burn",
          render: splitLookup,
        },
      ],
    },
    pool: {
      type: ["PROVIDE_LIQUIDITY", "WITHDRAW_LIQUIDITY"],
      columns: [
        {
          dataIndex: ["data", "assets"],
          title: "assets",
          render: parseLookup,
        },
        {
          dataIndex: ["data", "refundAssets"],
          title: "refund",
          render: parseLookup,
        },
      ],
    },
    stake: {
      type: ["STAKE", "UNSTAKE", "WITHDRAW_REWARDS"],
      columns: [
        {
          dataIndex: ["data", "amount"],
          title: "amount",
          render: renderAmount,
        },
      ],
    },
    gov: {
      type: ["GOV_STAKE", "GOV_UNSTAKE"],
      columns: [
        {
          dataIndex: ["data", "amount"],
          title: "amount",
          render: renderAmount,
        },
      ],
    },
    airdrop: {
      type: ["CLAIM_AIRDROP"],
      columns: [
        {
          dataIndex: ["data", "amount"],
          title: "amount",
          render: renderAmount,
        },
      ],
    },
  }

  const createCSV = (columns: Column[], types: string[]) => {
    const headings = columns.map(({ title }) => title)
    const rows = txs
      .filter(({ type }) => types.includes(type))
      .map((tx) =>
        columns.map(({ dataIndex, render }) => {
          const value = path(dataIndex, tx) as string
          return render?.(value, tx) ?? value
        })
      )

    const content = rows.map((cell) => cell.join(","))
    const csv = [HEAD, [headings, ...content].join("\n")].join()

    return { href: encodeURI(csv), count: rows.length }
  }

  const allTypes = Object.values(data).reduce<string[]>(
    (acc, { type }) => [...acc, ...type],
    []
  )

  const allColumns = Object.values(data).reduce<Column[]>(
    (acc, { columns }) => {
      const filtered = columns.filter(
        (column) => !acc.some(({ title }) => title === column.title)
      )

      return [...acc, ...filtered]
    },
    []
  )

  const all = {
    children: "All",
    ...createCSV([...defaultColumns, ...allColumns], allTypes),
  }

  const categorized = Object.entries(data).map(([key, { type, columns }]) => ({
    children: key,
    ...createCSV([...defaultColumns, ...columns], type),
  }))

  return [all, ...categorized]
}

export default useDownloadCSV
