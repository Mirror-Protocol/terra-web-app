import { minus, plus, sum } from "../../libs/math"
import { useUusdBalance } from "../native/balance"
import { useMyHolding } from "./holding"
import { useMyLimitOrder } from "./limit"
import { useMyBorrowing } from "./borrowing"
import { useMyPool } from "./pool"
import { useMyFarming } from "./farming"
import { useMyShortFarming } from "./short"
import { useMyGov } from "./gov"

export const useMyTotal = () => {
  const uusd = useUusdBalance()
  const holding = useMyHolding()
  const limitOrder = useMyLimitOrder()
  const borrowing = useMyBorrowing()
  const pool = useMyPool()
  const farming = useMyFarming()
  const short = useMyShortFarming()
  const gov = useMyGov()

  const list = {
    uusd,
    holding: holding.totalValue,
    limitOrder: limitOrder.totalValue,
    borrowing: minus(
      borrowing.totalCollateralValue,
      borrowing.totalMintedValue
    ),
    pool: pool.totalWithdrawableValue,
    farming: sum([
      farming.totalWithdrawableValue,
      farming.totalRewardsValue,
      short.totalRewardsValue,
      short.totalLockedUST,
      short.totalUnlockedUST,
    ]),
    gov: plus(gov.stakedValue, gov.votingRewardsValue),
  }

  const total = sum(Object.values(list))

  return {
    list,
    total,
    uusd,
    holding,
    limitOrder,
    borrowing,
    pool,
    farming,
    short,
    gov,
  }
}
