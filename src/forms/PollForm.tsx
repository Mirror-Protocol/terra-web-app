import useNewContractMsg from "../terra/useNewContractMsg"
import { useContractsAddress } from "../hooks"
import { useGov } from "../graphql/useGov"
import useEstimateTime from "../pages/Poll/useEstimateTime"
import { PollStatus, Type } from "../pages/Poll/Poll"
import PollItem from "../pages/Poll/PollItem"
import FormContainer from "./FormContainer"

interface Props {
  type: Type
  tab: Tab
  poll: Poll
}

const PollForm = ({ type, tab, poll }: Props) => {
  /* poll */
  const estimatedTime = useEstimateTime(poll)
  const { polls, config } = useGov()
  const { id } = poll

  /* context */
  const { contracts } = useContractsAddress()

  /* submit */
  const newContractMsg = useNewContractMsg()

  const data = {
    [Type.END]: [
      newContractMsg(contracts["gov"], { end_poll: { poll_id: id } }),
    ],
    [Type.EXECUTE]: [
      newContractMsg(contracts["gov"], { execute_poll: { poll_id: id } }),
    ],
  }[type]

  const enableStatus = {
    [Type.END]: PollStatus.InProgress,
    [Type.EXECUTE]: PollStatus.Passed,
  }[type]

  const enableHeight =
    polls.height &&
    config &&
    {
      [Type.END]: polls.height > poll.end_height,
      [Type.EXECUTE]: polls.height > poll.end_height + config.effective_delay,
    }[type]

  const messages = !enableHeight ? [estimatedTime[type]] : undefined
  const disabled = poll?.status !== enableStatus || !!messages?.length
  const container = { data, tab, disabled, messages }

  return (
    <FormContainer {...container} gov>
      <PollItem id={id} />
    </FormContainer>
  )
}

export default PollForm
