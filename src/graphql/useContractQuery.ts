import { useQuery, useLazyQuery } from "@apollo/client"
import { CONTRACT, WASMQUERY } from "./gqldocs"
import { parseResult } from "./response"

export const useLazyContractQuery = <Parsed>(params: ContractVariables) => {
  const variables = generateVariables(params)
  const [load, result] = useLazyQuery<ContractsData>(CONTRACT, { variables })
  return { result: { load, ...result }, parsed: parse<Parsed>(result) }
}

export default <Parsed>(params: ContractVariables) => {
  const variables = generateVariables(params)
  const result = useQuery<ContractsData>(CONTRACT, { variables })
  return { result, parsed: parse<Parsed>(result) }
}

/* helpers */
const generateVariables = ({ contract, msg }: ContractVariables) => {
  return { contract, msg: JSON.stringify(msg) }
}

const parse = <Parsed>({ data }: { data?: ContractsData }) =>
  data && parseResult<Parsed>(data[WASMQUERY])
