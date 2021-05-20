import { gql, useLazyQuery } from "@apollo/client"

const QUERY = gql`
  query BankBalancesAddress($address: String) {
    BankBalancesAddress(Address: $address) {
      Result {
        Amount
        Denom
      }
    }
  }
`

export default (address: string) => {
  const [load, result] = useLazyQuery(QUERY, { variables: { address } })
  return { load, ...result }
}
