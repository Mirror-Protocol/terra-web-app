import { formatAsset } from "../../libs/parse"
import { plus } from "../../libs/math"
import { findPathFromContract } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const fc = findPathFromContract(logs)

  const stakingRewardsAmount = fc("withdraw")("amount")
  const votingRewardsAmount = fc("withdraw_voting_rewards")("amount")
  const amount = plus(stakingRewardsAmount, votingRewardsAmount)

  return [{ title: "Claimed", content: formatAsset(amount, "MIR") }]
}
