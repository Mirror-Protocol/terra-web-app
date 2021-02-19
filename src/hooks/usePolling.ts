import { useEffect } from "react"
import { useResult } from "./useContract"

const usePolling = () => {
  const { pair } = useResult()
  const { startPolling, stopPolling } = pair

  useEffect(() => {
    startPolling?.(999)
  }, [startPolling])

  useEffect(() => {
    return () => stopPolling?.()
  }, [stopPolling])
}

export default usePolling
