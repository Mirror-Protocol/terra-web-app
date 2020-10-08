import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const generate = ({ token, pair }: ListedItem) => {
    return { token, contract: pair, msg: { pool: {} } }
  }

  const query = useLazyContractQueries<PairPool>(generate)
  return query
}
