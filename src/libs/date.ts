import { addMinutes, format } from "date-fns"

export const getUTCDate = () => {
  const offset = new Date().getTimezoneOffset()
  const utc = addMinutes(new Date(), offset)
  return format(utc, "MMM d")
}
