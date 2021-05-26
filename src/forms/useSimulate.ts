import { useEffect, useMemo, useState } from "react"
import { equals } from "ramda"
import { div, gt } from "../libs/math"
import { useContractsAddress } from "../hooks"
import { useLazyContractQuery } from "../graphql/useContractQuery"
import { Type } from "../pages/Trade"

interface Params {
  amount: string
  token: string
  pair: string
  reverse: boolean
  type: Type
}

interface SimulatedData {
  return_amount: string
  offer_amount: string
  commission_amount: string
  spread_amount: string
}

interface Simulated {
  amount: string
  spread: string
  commission: string
  price: string
}

interface Result {
  params: Params
  simulated: Simulated
}

export default ({ amount, token, pair, reverse, type }: Params) => {
  const params = useMemo(
    () => ({ amount, token, pair, reverse, type }),
    [amount, token, pair, reverse, type]
  )

  const [results, setResults] = useState<Result[]>([])

  /* context */
  const { toToken } = useContractsAddress()

  /* query */
  const variables = {
    contract: pair,
    msg: !reverse
      ? { simulation: { offer_asset: toToken({ token, amount }) } }
      : { reverse_simulation: { ask_asset: toToken({ token, amount }) } },
  }

  const valid = amount && gt(amount, 0) && token && pair
  const { result, parsed } = useLazyContractQuery<SimulatedData>(
    variables,
    "Simulate"
  )

  const { load, error } = result

  useEffect(() => {
    valid && load()
  }, [valid, load])

  const simulatedAmount = !reverse
    ? parsed?.return_amount
    : parsed?.offer_amount

  const spread = parsed?.spread_amount
  const commission = parsed?.commission_amount

  const price = {
    [Type.BUY]: !reverse
      ? div(amount, simulatedAmount)
      : div(simulatedAmount, amount),
    [Type.SELL]: !reverse
      ? div(simulatedAmount, amount)
      : div(amount, simulatedAmount),
  }[type]

  useEffect(() => {
    if (!error) {
      if (simulatedAmount && spread && commission && price) {
        setResults((prev) => {
          const amount = simulatedAmount
          const simulated = { amount, spread, commission, price }
          return [...prev, { params, simulated }]
        })
      }
    }
  }, [simulatedAmount, spread, commission, price, error, params])

  const simulated = results.find((result) =>
    equals(result.params, params)
  )?.simulated

  return { ...result, simulated }
}
