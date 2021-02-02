import { useEffect } from "react"
import { useContractsAddress } from "../../hooks"
import { useLazyContractQuery } from "../useContractQuery"

const useMintPosition = (idx?: string) => {
  const { contracts } = useContractsAddress()

  const query = useLazyContractQuery<MintPosition>({
    contract: contracts["mint"],
    msg: { position: { position_idx: idx } },
  })

  const { load, refetch } = query.result

  useEffect(() => {
    idx && (refetch?.() ?? load())
  }, [idx, load, refetch])

  return query
}

export default useMintPosition
