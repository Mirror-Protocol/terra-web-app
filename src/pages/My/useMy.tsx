import { uniq } from "ramda"
import { useRefetch } from "../../hooks"
import { DataKey } from "../../hooks/useContract"
import useMyHoldings from "./useMyHoldings"
import useMyMint from "./useMyMint"
import useMyPool from "./useMyPool"
import useMyStake from "./useMyStake"

const useMy = () => {
  const holdings = useMyHoldings()
  const mint = useMyMint()
  const pool = useMyPool()
  const stake = useMyStake()

  const keys = uniq(
    [holdings, mint, pool, stake].reduce<DataKey[]>(
      (acc, { keys }) => [...acc, ...keys],
      []
    )
  )

  useRefetch(keys)

  return { holdings, mint, pool, stake }
}

export default useMy
