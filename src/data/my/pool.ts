import { atom, selector } from "recoil"
import { gt, sum } from "../../libs/math"
import { StakingKey } from "../../hooks/contractKeys"
import { useStoreLoadable } from "../utils/loadable"
import { protocolQuery } from "../contract/protocol"
import { findStakingQuery } from "../contract/normalize"
import { poolQuery } from "../../forms/usePool"

export const myPoolQuery = selector({
  key: "myPool",
  get: ({ get }) => {
    const { listedAll } = get(protocolQuery)

    const findStaking = get(findStakingQuery)
    const getPool = get(poolQuery)

    const dataSource = listedAll
      .map((item: ListedItem) => {
        const { token } = item
        const balance = findStaking(StakingKey.LPSTAKABLE, token)
        const { fromLP } = getPool({ amount: balance, token })
        return { ...item, balance, withdrawable: fromLP }
      })
      .filter(({ balance }) => gt(balance, 0))

    const totalWithdrawableValue = sum(
      dataSource.map(({ withdrawable }) => withdrawable?.value ?? 0)
    )

    return { dataSource, totalWithdrawableValue }
  },
})

const myPoolState = atom({
  key: "myPoolState",
  default: myPoolQuery,
})

export const useMyPool = () => {
  return useStoreLoadable(myPoolQuery, myPoolState)
}
