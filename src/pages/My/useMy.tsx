import { uniq } from "ramda"
import { minus, sum } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import { DataKey, useContract } from "../../hooks/useContract"
import useMyHoldings from "./useMyHoldings"
import useMyMint from "./useMyMint"
import useMyPool from "./useMyPool"
import useMyStake from "./useMyStake"
import useMyOrders from "./useMyOrders"

const useMy = () => {
  const holdings = useMyHoldings()
  const mint = useMyMint()
  const pool = useMyPool()
  const stake = useMyStake()
  const orders = useMyOrders()

  const keys = uniq(
    [holdings, mint, pool, stake, orders].reduce<DataKey[]>(
      (acc, { keys }) => [...acc, ...keys],
      []
    )
  )

  const { data } = useRefetch([...keys, AccountInfoKey.UUSD])

  /* total */
  const { uusd } = useContract()
  const values = {
    uusd,
    holdings: holdings.totalValue,
    minted: mint.totalMintedValue,
    collateral: mint.totalCollateralValue,
    withdrawble: pool.totalWithdrawableValue,
    reward: stake.totalRewardsValue,
    govStaked: stake.govStakedValue,
    orders: orders.total,
  }

  const total = { value: calcTotalValue(values), loading: !data }

  return { holdings, mint, pool, stake, total, orders }
}

export default useMy

/* calc */
interface Values {
  uusd: string
  holdings: string
  minted: string
  collateral: string
  withdrawble: string
  reward: string
  govStaked: string
}

export const calcTotalValue = (values: Values) => {
  const { holdings, minted, collateral, withdrawble, reward } = values
  const { uusd, govStaked } = values

  return minus(
    sum([holdings, collateral, withdrawble, reward, govStaked, uusd]),
    minted
  )
}
