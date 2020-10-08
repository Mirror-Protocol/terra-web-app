import { format, formatAsset } from "../libs/parse"
import { useContractsAddress } from "../hooks"
import parser from "./parser"

export default (parserKey: string, results: Attribute[]) => {
  const { getSymbol } = useContractsAddress()

  const parseItem = (item: ResultParserItem) => {
    const { valueKey, amountKey, symbolKey, tokenKey, ...rest } = item
    const value = valueKey && find(valueKey, results)
    const token = tokenKey && find(tokenKey, results)
    const amount = amountKey && find(amountKey, results)
    const symbol =
      rest.symbol ?? (symbolKey && getSymbol(find(symbolKey, results)))

    return (
      value ??
      (token && parseTokens(token)) ??
      (amount && symbol
        ? formatAsset(amount, symbol)
        : (amount && format(amount)) ?? symbol)
    )
  }

  const parseTokens = (tokens: string) =>
    tokens.split(", ").map((token) => {
      const [, amount, key] = token.split(/(\d+)(\w+)/)
      return formatAsset(amount, getSymbol(key))
    })

  return parserKey === "default"
    ? results.map(({ Key, Value }) => ({ title: Key, content: Value }))
    : Object.entries(parser[parserKey]).reduce<Content[]>(
        (acc, [title, item]) => {
          const content = parseItem(item)
          const next = { title, content }
          return content ? [...acc, next] : acc
        },
        []
      )
}

/* utils */
const find = (key: string, attribute: Attribute[]) =>
  attribute.find(({ Key, Value }) => Key === key)?.Value ?? ""
