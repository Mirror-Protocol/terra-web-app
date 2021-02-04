import { format, addMilliseconds } from "date-fns"
import { BLOCK_TIME } from "../../constants"

/* end */
export const estimateTime = (current: number, next: number) => {
  const estimated = addMilliseconds(new Date(), (next - current) * BLOCK_TIME)
  return format(estimated, "EEE, LLL dd, HH:mm aa")
}

/* link */
export const replaceLink = (paragraph: string = "") => {
  const replaced = paragraph.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return { dangerouslySetInnerHTML: { __html: replaced } }
}
