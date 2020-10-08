import { useGov } from "../../graphql/useGov"
import { estimateTime } from "./pollHelpers"

export default (id: number) => {
  const { polls, config } = useGov()
  const { height, data } = polls
  const poll = data[id]

  return {
    end: height && poll ? estimateTime(height, poll.end_height) : "",
    execute:
      height && poll && config
        ? estimateTime(height, poll.end_height + config.effective_delay)
        : "",
  }
}
