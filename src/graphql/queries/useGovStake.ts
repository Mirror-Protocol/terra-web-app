import { useContractsAddress } from "../../hooks"
import { useLazyContractQuery } from "../useContractQuery"

export default (address: string) => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["gov"], msg: { staker: { address } } }
  const query = useLazyContractQuery<GovStaker>(variables)
  return query
}
