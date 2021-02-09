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

/* link */
export const replaceLink = (paragraph: string = "") => {
  const replaced = paragraph.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return { dangerouslySetInnerHTML: { __html: replaced } }
}

/* status */
export const isWaitingExecution = (poll: Poll) =>
  poll.status === PollStatus.Passed && poll.type !== "TEXT"

export const isEmphasizedPoll = (poll: Poll) =>
  poll.status === PollStatus.InProgress || isWaitingExecution(poll)
