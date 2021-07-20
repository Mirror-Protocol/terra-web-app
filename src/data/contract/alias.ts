import { gql } from "graphql-request"
import { WASMQUERY } from "../../constants"

interface Query extends Partial<ContractVariables> {
  name: string
}

const getDocument = ({ name, contract, msg }: Query) =>
  !msg
    ? ``
    : `
    ${name}: ${WASMQUERY}(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

export default (queries: Query[], name: string) => gql`
  query ${name} {
    ${queries.map(getDocument)}
  }
`

export const stringify = (msg: object) =>
  JSON.stringify(msg).replace(/"/g, '\\"')
