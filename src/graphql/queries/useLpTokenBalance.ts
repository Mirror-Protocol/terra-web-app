import { useLazyContractQueries } from "../useContractQueries"

export default (address: string) => {
  const generate = ({ lpToken }: ListedItem) => {
    return { contract: lpToken, msg: { balance: { address } } }
  }

  const query = useLazyContractQueries<Balance>(generate)
  return query
}
