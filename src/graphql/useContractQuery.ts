import { useQuery, useLazyQuery } from "@apollo/client"
import { getContract, WASMQUERY } from "./gqldocs"
import { parseResult } from "./response"

export const useLazyContractQuery = <Parsed>(
  params: ContractVariables,
  name: string
) => {
  const variables = generateVariables(params)
  const [load, result] = useLazyQuery<ContractsData>(getContract(name), {
    variables,
  })

  return { result: { load, ...result }, parsed: parse<Parsed>(result) }
}

export default <Parsed>(params: ContractVariables, name: string) => {
  const variables = generateVariables(params)
  const result = useQuery<ContractsData>(getContract(name), { variables })
  return { result, parsed: parse<Parsed>(result) }
}

/* helpers */
const generateVariables = ({ contract, msg }: ContractVariables) => {
  return { contract, msg: JSON.stringify(msg) }
}

const parse = <Parsed>({ data }: { data?: ContractsData }) =>
  data && parseResult<Parsed>(data[WASMQUERY])
