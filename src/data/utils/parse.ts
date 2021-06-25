export const parseResult = <Parsed>(params: { Result: string } | null) =>
  params ? (JSON.parse(params.Result) as Parsed) : undefined

export const parseResults = <Parsed>(object: Dictionary<ContractData | null>) =>
  Object.entries(object).reduce<Dictionary<Parsed>>((acc, [token, data]) => {
    const next = data && parseResult<Parsed>(data)
    return Object.assign({}, acc, next && { [token]: next })
  }, {})
