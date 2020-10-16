import { useResult } from "./useContract"
import { DataKey } from "./useContract"

export const useCombineKeys = (keys: (DataKey | undefined)[]): Result => {
  const result = useResult()
  const errorKey = keys.find((key) => key && result[key].error)

  return {
    data: keys.every((key) => key && result[key].data),
    loading: keys.some((key) => key && result[key].loading),
    error: errorKey && result[errorKey].error,
  }
}

export default (results: (Result | undefined)[]): Result => {
  const findError = (results: (Result | undefined)[]) => {
    const errorResult = Object.values(results).find((result) => result?.error)
    return errorResult && errorResult.error
  }

  return {
    data: results.every((result) => result?.data),
    loading: results.some((result) => result?.loading),
    error: findError(results),
  }
}
