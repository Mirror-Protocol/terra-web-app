import { formatAsset } from "../../libs/parse"
import { plus } from "../../libs/math"
import { fromContract } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const [staking, voting] = fromContract(logs)

  const stakingRewardsAmount = staking?.withdraw?.amount
  const votingRewardsAmount = voting?.withdraw_voting_rewards?.amount
  const amount = plus(stakingRewardsAmount, votingRewardsAmount)

  return [{ title: "Claimed", content: formatAsset(amount, "MIR") }]
}
