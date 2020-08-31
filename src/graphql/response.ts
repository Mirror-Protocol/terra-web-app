import { Dictionary } from "ramda"

export const parseResult = <Parsed>(params: { Result?: string } | null) =>
  params && params.Result ? (JSON.parse(params.Result) as Parsed) : undefined

/* alias */
export const parseResults = <Parsed>(object?: Dictionary<ContractData>) =>
  object &&
  Object.entries(object).reduce<Dictionary<Parsed>>((acc, [token, data]) => {
    const next = parseResult<Parsed>(data)
    return Object.assign({}, acc, next && { [token]: next })
  }, {})
