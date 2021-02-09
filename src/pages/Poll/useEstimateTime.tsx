import { useGov } from "../../graphql/useGov"
import { PollStatus } from "./Poll"
import { estimateTime } from "./pollHelpers"

export default (poll?: Poll) => {
  const { polls, config } = useGov()
  const { height } = polls

  return !(height && poll && config)
    ? { label: "", text: "", toNow: "" }
    : poll.status === PollStatus.Executed
    ? {
        label: "Executed",
        ...estimateTime(height, poll.end_height + config.effective_delay),
      }
    : poll.status === PollStatus.Passed && poll.type !== "TEXT"
    ? {
        label: "Estimated execution time",
        ...estimateTime(height, poll.end_height + config.effective_delay),
      }
    : poll.status === PollStatus.InProgress
    ? {
        label: "Estimated end time",
        ...estimateTime(height, poll.end_height),
      }
    : {
        label: "Ended",
        ...estimateTime(height, poll.end_height),
      }
}
