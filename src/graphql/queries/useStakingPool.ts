import { useContractsAddress } from "../../hooks"
import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const { contracts } = useContractsAddress()
  const generate = ({ token }: ListedItem) => ({
    contract: contracts["staking"],
    msg: { pool_info: { asset_token: token } },
  })

  const query = useLazyContractQueries<StakingPool>(generate)
  return query
}
