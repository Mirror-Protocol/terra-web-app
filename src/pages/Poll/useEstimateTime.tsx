import { useGov } from "../../graphql/useGov"
import { estimateTime } from "./pollHelpers"

export default (poll?: Poll) => {
  const { polls, config } = useGov()
  const { height } = polls

  return {
    label:
      !height || !poll
        ? ""
        : poll.end_height > height
        ? "Estimated end time"
        : "Ended",
    end: height && poll ? estimateTime(height, poll.end_height) : "",
    execute:
      height && poll && config
        ? estimateTime(height, poll.end_height + config.effective_delay)
        : "",
  }
}
