export const findValue = (logs: TxLog[]) => (key: string, index = 0) => {
  const attribute = logs[index]?.Events.find((e) => e.Type === "from_contract")
    ?.Attributes

  return attribute?.find((attr) => attr.Key === key)?.Value ?? ""
}

export const splitTokenText = (string: string) => {
  const [, amount, token] = string.split(/(\d+)(\w+)/)
  return { amount, token }
}

export const parseTokenText = (string: string) =>
  string.split(", ").map(splitTokenText)
