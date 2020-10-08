import { useResult } from "./useContract"
import { DataKey } from "./useContract"

export default (keys: (DataKey | undefined)[]): Result => {
  const result = useResult()
  const errorKey = keys.find((key) => key && result[key].error)

  return {
    data: keys.every((key) => key && result[key].data),
    loading: keys.some((key) => key && result[key].loading),
    error: errorKey && result[errorKey].error,
  }
}
