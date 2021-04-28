import { format, addMilliseconds, formatDistanceToNow } from "date-fns"
import { BLOCK_TIME } from "../../constants"
import { capitalize } from "../../libs/utils"
import { PollStatus } from "./Poll"

/* end */
export const estimateTime = (current: number, next: number) => {
  const estimated = addMilliseconds(new Date(), (next - current) * BLOCK_TIME)
  const text = format(estimated, "EEE, LLL dd, HH:mm aa")
  const toNow = capitalize(formatDistanceToNow(estimated, { addSuffix: true }))
  return { text, toNow }
}

/* status */
export const isWaitingExecution = (poll: Poll) =>
  poll.status === PollStatus.Passed && poll.type !== "TEXT"

export const isEmphasizedPoll = (poll: Poll) =>
  poll.status === PollStatus.InProgress || isWaitingExecution(poll)
