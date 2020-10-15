import { MIR } from "../../constants"
import { useContractsAddress } from "../../hooks"
import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const { contracts } = useContractsAddress()
  const generate = ({ token, symbol }: ListedItem) => {
    const variables = {
      contract: contracts["mint"],
      msg: { asset_config: { asset_token: token } },
    }

    return symbol === MIR ? undefined : variables
  }

  const query = useLazyContractQueries<MintInfo>(generate)
  return query
}
