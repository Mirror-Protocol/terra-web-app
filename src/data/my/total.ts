import { minus, plus, sum } from "../../libs/math"
import { useUusdBalance } from "../native/balance"
import { useMyHolding } from "./holding"
import { useMyLimitOrder } from "./limit"
import { useMyBorrowing } from "./borrowing"
import { useMyFarming } from "./farming"
import { useMyShortFarming } from "./short"
import { useMyGov } from "./gov"

export const useMyTotal = () => {
  const uusd = useUusdBalance()
  const holding = useMyHolding()
  const limitOrder = useMyLimitOrder()
  const borrowing = useMyBorrowing()
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
    farming: sum([
      farming.totalWithdrawableValue,
      farming.totalRewardsValue,
      short.totalRewardsValue,
      short.totalLockedUST,
      short.totalUnlockedUST,
    ]),
    gov: plus(gov.stakedValue, gov.votingRewardsValue),
  }

  return { list, total: sum(Object.values(list)) }
}
