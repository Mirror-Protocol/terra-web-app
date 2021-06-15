import { selector } from "recoil"
import { minus, plus, sum } from "../../libs/math"
import { uusdBalanceQuery } from "../native/balance"
import { myHoldingQuery } from "./holding"
import { myLimitOrderQuery } from "./limit"
import { myBorrowingQuery } from "./borrowing"
import { myFarmingQuery } from "./farming"
import { myLockedUSTQuery } from "./locked"
import { myShortFarmingQuery } from "./short"
import { myGovQuery } from "./gov"

export const myTotalQuery = selector({
  key: "myTotal",
  get: ({ get }) => {
    const uusd = get(uusdBalanceQuery)
    const holding = get(myHoldingQuery)
    const limitOrder = get(myLimitOrderQuery)
    const borrowing = get(myBorrowingQuery)
    const farming = get(myFarmingQuery)
    const short = get(myShortFarmingQuery)
    const locked = get(myLockedUSTQuery)
    const gov = get(myGovQuery)

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
        locked.totalLockedUST,
        locked.totalUnlockedUST,
      ]),
      gov: plus(gov.stakedValue, gov.votingRewardsValue),
    }

    return { list, total: sum(Object.values(list)) }
  },
})
