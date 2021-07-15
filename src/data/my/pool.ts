import { gt, sum } from "../../libs/math"
import { StakingKey } from "../../hooks/contractKeys"
import { useProtocol } from "../contract/protocol"
import { useFindStaking } from "../contract/normalize"
import usePool from "../../forms/modules/usePool"

export const useMyPool = () => {
  const { listedAll, getIsDelisted } = useProtocol()

  const { contents: findStaking, isLoading } = useFindStaking()
  const getPool = usePool()

  const dataSource = listedAll
    .map((item: ListedItem) => {
      const { token } = item
      const balance = findStaking(StakingKey.LPSTAKABLE, token)
      const { fromLP } = getPool({ amount: balance, token })

      return {
        ...item,
        delisted: getIsDelisted(token),
        balance,
        withdrawable: fromLP,
      }
    })
    .filter(({ balance }) => gt(balance, 0))

  const totalWithdrawableValue = sum(
    dataSource.map(({ withdrawable }) => withdrawable?.value ?? 0)
  )

  return { dataSource, totalWithdrawableValue, isLoading }
}
