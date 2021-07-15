/* find the first value by key */
export const findValueFromLogs =
  (logs: TxLog[]) =>
  (key: string, index = 0) => {
    const attribute = logs[index]?.Events.find(
      (e) => e.Type === "from_contract"
    )?.Attributes

    return attribute?.find((attr) => attr.Key === key)?.Value ?? ""
  }

export const concatFromContract = (logs: TxLog[]) => {
  return logs
    .map(({ Events }) => {
      const attributes = Events.find(
        ({ Type }) => Type === "from_contract"
      )?.Attributes

      return attributes?.reduce<FromContract[]>((acc, { Key, Value }) => {
        const sep = Key === "contract_address"
        const last = acc[acc.length - 1]
        return sep
          ? [...acc, { [Key]: Value }]
          : [...acc.slice(0, acc.length - 1), { ...last, [Key]: Value }]
      }, [])
    })
    .reduce<FromContract[]>((acc = [], cur = []) => [...acc, ...cur], [])
}

export const findPathFromContract = (logs: TxLog[]) => {
  return (action: string) =>
    (key: string, index = 0) =>
      concatFromContract(logs)
        .filter((fc) => fc.action === action)
        .filter((fc) => fc[key])
        .map((fc) => fc[key])[index] ?? ""
}

export const parseEvents = (events: TxEvent[]) =>
  events.reduce<Dictionary<Dictionary>>(
    (acc, { Type, Attributes }) => ({
      ...acc,
      [Type]: parseAttributes(Attributes),
    }),
    {}
  )

const parseAttributes = (attributes: Attribute[]) =>
  attributes.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {})

export const splitTokenText = (string = "") => {
  const [, amount, token] = string.split(/(\d+)(\w+)/)
  return { amount, token }
}

export const parseTokenText = (string?: string) =>
  string?.split(", ").map(splitTokenText) ?? []
