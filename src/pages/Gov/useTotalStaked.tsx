import { useRecoilValue } from "recoil"
import { minus, isFinite } from "../../libs/math"
import { useGovState } from "../../data/gov/state"
import { mirrorTokenGovBalanceQuery } from "../../data/contract/info"

export const useTotalStaked = () => {
  const state = useGovState()
  const balance = useRecoilValue(mirrorTokenGovBalanceQuery)

  return [balance, state?.total_deposit].every(isFinite)
    ? minus(balance, state?.total_deposit)
    : "0"
}
