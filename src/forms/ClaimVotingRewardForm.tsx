import { useRouteMatch } from "react-router-dom"
import { useRecoilValue } from "recoil"
import useNewContractMsg from "../libs/useNewContractMsg"
import { gt, plus } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { useFindBalance } from "../data/contract/normalize"
import { calcVotingRewards, govAddressVoterQuery } from "../data/contract/gov"
import { usePoll } from "../data/gov/poll"
import Formatted from "../components/Formatted"
import Container from "../components/Container"
import useClaimRewardsReceipt from "./receipts/useClaimRewardsReceipt"
import FormContainer from "./modules/FormContainer"

const ClaimVotingRewardForm = () => {
  const { params } = useRouteMatch<{ id: string }>()
  const id = Number(params.id)

  /* context */
  const { contracts, getToken } = useProtocol()
  const { contents: findBalance } = useFindBalance()
  const poll = usePoll(id)
  const voter = useRecoilValue(govAddressVoterQuery(id))
  const balance = findBalance(getToken("MIR"))
  const claiming = poll && voter ? calcVotingRewards(poll, voter) : "0"

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
  const data = [
    newContractMsg(contracts["gov"], {
      withdraw_voting_rewards: { poll_id: id },
    }),
  ]

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

export default ClaimVotingRewardForm
