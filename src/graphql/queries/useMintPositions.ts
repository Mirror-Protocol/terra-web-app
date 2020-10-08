import { useContractsAddress } from "../../hooks"
import { useLazyContractQuery } from "../useContractQuery"

export default (address: string) => {
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["mint"],
    msg: { positions: { owner_addr: address } },
  }

  const query = useLazyContractQuery<MintPositions>(variables)
  return query
}
