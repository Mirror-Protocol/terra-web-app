import { useContractsAddress } from "hooks/useContractsAddress"
import { useLazyContractQuery } from "../useContractQuery"

export default (address: string) => {
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["mint"],
    msg: { positions: { owner_addr: address, limit: Math.pow(2, 32) - 1 } },
  }

  const query = useLazyContractQuery<MintPositions>(variables)
  return query
}
