import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const generate = ({ lpToken }: ListedItem) => {
    return { contract: lpToken, msg: { token_info: {} } }
  }

  const query = useLazyContractQueries<TotalSupply>(generate)
  return query
}
