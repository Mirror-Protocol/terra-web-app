import { MIR } from "constants/constants"
import { useLazyContractQueries } from "graphql/useContractQueries"
import { useContractsAddress } from "hooks/useContractsAddress"

export default () => {
  const { contracts } = useContractsAddress()
  const generate = ({ token, symbol }: ListedItem) => {
    const variables = {
      contract: contracts["oracle"],
      msg: { price: { asset_token: token } },
    }

    return symbol === MIR ? undefined : variables
  }

  const query = useLazyContractQueries<Price>(generate)
  return query
}
