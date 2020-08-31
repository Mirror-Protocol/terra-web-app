import { useContractsAddress } from "../../hooks"
import useContractQuery from "../../graphql/useContractQuery"

/* hooks */
export default () => {
  const { contracts } = useContractsAddress()
  const { result, parsed } = useContractQuery<{ total_supply: string }>({
    contract: contracts["mirrorToken"],
    msg: { token_info: {} },
  })

  return { result, value: parsed?.total_supply }
}
