import { formatDistanceToNow, addMilliseconds } from "date-fns"
import { BLOCK_TIME } from "../../constants"
import { capitalize } from "../../libs/utils"

/* end */
export const estimateTime = (current: number, next: number) => {
  const estimated = addMilliseconds(new Date(), (next - current) * BLOCK_TIME)
  return capitalize(formatDistanceToNow(estimated, { addSuffix: true }))
}

/* link */
export const replaceLink = (paragraph: string = "") => {
  const replaced = paragraph.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return { dangerouslySetInnerHTML: { __html: replaced } }
}
