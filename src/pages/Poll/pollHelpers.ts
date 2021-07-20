import { format, formatDistanceToNow } from "date-fns"
import { FMT } from "../../constants"
import { capitalize } from "../../libs/utils"
import { Poll, PollStatus } from "../../data/gov/poll"

/* end */
export const toText = (next?: number) => {
  if (!next) return { text: "", toNow: "" }

  const date = new Date(next * 1000)
  const text = format(date, FMT.HHmm)
  const toNow = capitalize(formatDistanceToNow(date, { addSuffix: true }))
  return { text, toNow }
}

/* status */
export const isWaitingExecution = (poll: Poll) =>
  poll.status === PollStatus.Passed && !poll.type?.includes("TEXT")

export const isEmphasizedPoll = (poll: Poll) =>
  poll.status === PollStatus.InProgress || isWaitingExecution(poll)
