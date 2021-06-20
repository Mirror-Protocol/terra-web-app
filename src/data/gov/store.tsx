import { minus, isFinite } from "../../libs/math"
import { useGovState } from "./state"
import { useMirrorTokenGovBalance } from "../contract/info"

export const useTotalStaked = () => {
  const state = useGovState()
  const balance = useMirrorTokenGovBalance()

  return [balance, state?.total_deposit].every(isFinite)
    ? minus(balance, state?.total_deposit)
    : "0"
}
