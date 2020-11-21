import { gql } from "@apollo/client"
import { WASMQUERY } from "./gqldocs"

interface Query extends Partial<ContractVariables> {
  token: string
}

const alias = ({ token, contract, msg }: Query) =>
  !msg
    ? ``
    : `
    ${token}: ${WASMQUERY}(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

export default (queries: Query[]) => gql`
  query {
    ${queries.map(alias)}
  }
`

export const stringify = (msg: object) =>
  JSON.stringify(msg).replace(/"/g, '\\"')
