import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const generate = ({ token, pair }: ListedItem) => {
    return { token, contract: pair, msg: { config_swap: {} } }
  }

  const query = useLazyContractQueries<PairConfig>(generate)
  return query
}
