import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import { UUSD } from "../constants"

type State = "OPEN" | "CLOSED"

const useLatest = () => {
  const [closed, setClosed] = useState<Dictionary<State>>({})
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const load = async () => {
      try {
        const url = "https://price.mirror.finance/latest"
        const response = await fetch(url)
        const json: { states: Dictionary<State> } = await response.json()
        setClosed(json.states)
      } catch (error) {
        setError(error)
      }
    }

    load()
  }, [])

  const isClosed = (symbol: string) => {
    const ticker = symbol.slice(1)
    return symbol !== UUSD && closed[ticker] === "CLOSED"
  }

  return { isClosed, error }
}

export default useLatest
