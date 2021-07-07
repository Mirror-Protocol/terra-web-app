import useNewContractMsg from "../libs/useNewContractMsg"
import { gt, plus } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { useFindBalance } from "../data/contract/normalize"
import { useRewards } from "../data/my/rewards"
import Formatted from "../components/Formatted"
import Container from "../components/Container"
import useClaimRewardsReceipt from "./receipts/useClaimRewardsReceipt"
import FormContainer from "./modules/FormContainer"

const ClaimRewardsForm = () => {
  /* context */
  const { contracts, getToken } = useProtocol()
  const { contents: findBalance } = useFindBalance()
  const { contents: rewards } = useRewards()

  const balance = findBalance(getToken("MIR"))
  const claiming = rewards.total

  /* confirm */
  const contents = [
    {
      title: "Claiming",
      content: <Formatted symbol="MIR">{claiming}</Formatted>,
    },
    {
      title: "MIR after Tx",
      content: <Formatted symbol="MIR">{plus(balance, claiming)}</Formatted>,
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const withdraw = {
    staking: newContractMsg(contracts["staking"], { withdraw: {} }),
    voting: newContractMsg(contracts["gov"], { withdraw_voting_rewards: {} }),
  }

  const data = gt(rewards.voting, 0)
    ? [withdraw.staking, withdraw.voting]
    : [withdraw.staking]

  const disabled = !gt(claiming, 0)

  /* result */
  const parseTx = useClaimRewardsReceipt()

  const container = { contents, disabled, data, parseTx }
  const props = { tab: { tabs: ["Claim"], current: "Claim" }, label: "Claim" }

  return (
    <Container sm>
      <FormContainer {...container} {...props} />
    </Container>
  )
}

export default ClaimRewardsForm
