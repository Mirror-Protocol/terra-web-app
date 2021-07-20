import { useGovConfig } from "../../data/gov/config"
import { Poll, PollStatus } from "../../data/gov/poll"
import { toText } from "./pollHelpers"

const usePollTimeText = (poll?: Poll) => {
  const config = useGovConfig()

  return !(poll && config)
    ? { label: "", text: "", toNow: "" }
    : poll.status === PollStatus.Executed
    ? {
        label: "Executed",
        ...toText(poll.end_time + config.effective_delay),
      }
    : poll.status === PollStatus.Passed && poll.type !== "TEXT"
    ? {
        label: "Execution time",
        ...toText(poll.end_time + config.effective_delay),
      }
    : poll.status === PollStatus.InProgress
    ? {
        label: "End time",
        ...toText(poll.end_time),
      }
    : {
        label: "Ended",
        ...toText(poll.end_time),
      }
}

export default usePollTimeText
