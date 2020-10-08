import { useContractsAddress } from "../../hooks"
import { useLazyContractQuery } from "../useContractQuery"

export default (address: string) => {
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["staking"],
    msg: { reward_info: { staker: address } },
  }

  const query = useLazyContractQuery<StakingReward>(variables)
  return query
}
