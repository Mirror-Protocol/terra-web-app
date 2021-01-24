import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import { UUSD } from "../constants"

const useLatest = (symbol: string) => {
  const [isClosed, setClosed] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const load = async () => {
      try {
        type State = "OPEN" | "CLOSED"
        const url = "https://price.mirror.finance/latest"
        const response = await fetch(url)
        const json: { states: Dictionary<State> } = await response.json()
        const ticker = symbol.slice(1)
        setClosed(json.states[ticker] === "CLOSED")
      } catch (error) {
        setError(error)
      }
    }

    symbol && (symbol !== UUSD ? load() : setClosed(false))
  }, [symbol])

  return { isClosed, error }
}

export default useLatest
