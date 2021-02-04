import { useGov } from "../../graphql/useGov"
import { PollStatus } from "./Poll"
import { estimateTime } from "./pollHelpers"

export default (poll?: Poll) => {
  const { polls, config } = useGov()
  const { height } = polls

  return !(height && poll && config)
    ? { label: "", text: "" }
    : poll.status === PollStatus.Executed
    ? {
        label: "Executed",
        text: estimateTime(height, poll.end_height + config.effective_delay),
      }
    : poll.status === PollStatus.Passed && poll.type !== "TEXT"
    ? {
        label: "Estimated execution time",
        text: estimateTime(height, poll.end_height + config.effective_delay),
      }
    : poll.status === PollStatus.InProgress
    ? {
        label: "Estimated end time",
        text: estimateTime(height, poll.end_height),
      }
    : {
        label: "Ended",
        text: estimateTime(height, poll.end_height),
      }
}
