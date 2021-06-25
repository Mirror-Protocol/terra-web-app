import { addMinutes, format } from "date-fns"

export const getUTCDate = () => {
  const offset = new Date().getTimezoneOffset()
  const utc = addMinutes(new Date(), offset)
  return format(utc, "MMM d")
}

export const isPast = (second: number) => second * 1000 < Date.now()
export const isFuture = (second: number) => Date.now() < second * 1000
