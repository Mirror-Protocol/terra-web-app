import { useContractsAddress } from "hooks/useContractsAddress"
import { useCallback, useEffect, useMemo, useState } from "react"
import { div, gt } from "../libs/math"
import useAPI from "./useAPI"
interface Params {
  amount: string
  token: string
  pair: string
  reverse: boolean
}

interface SimulatedResponse {
  height: string
  result: SimulatedData
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
const useSwapSimulate = ({ amount, token, pair, reverse }: Params) => {
  const [simulated, setSimulated] = useState<Simulated>()
  /* context */
  const { toToken } = useContractsAddress()
  /* query */
  const variables = useMemo(() => {
    return {
      contract: pair,
      msg: !reverse
        ? { simulation: { offer_asset: toToken({ symbol: token, amount }) } }
        : {
            reverse_simulation: {
              ask_asset: toToken({ symbol: token, amount }),
            },
          },
    }
  }, [amount, pair, reverse, toToken, token])
  const { querySimulate } = useAPI()
  const isValidToSimulate = useMemo(() => {
    return amount && gt(amount, 0) && token && pair
  }, [amount, pair, token])

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SimulatedData>()
  const [error, setError] = useState<Error | undefined>(undefined)
  const isError: boolean = useMemo(() => !!error, [error])

  const fetchSimulatedData = useCallback(async () => {
    setIsLoading(true)
    const defaultValues: SimulatedData = {
      return_amount: "0",
      offer_amount: "0",
      commission_amount: "0",
      spread_amount: "0",
    }
    try {
      if (isValidToSimulate) {
        const res = await querySimulate(variables)
        if (!res?.data) {
          setResult(defaultValues)
        } else {
          setResult(res.data)
        }
      } else {
        setResult(defaultValues)
      }
      setError(undefined)
    } catch (error) {
      setResult(defaultValues)
      setError(error as any)
    } finally {
      setIsLoading(false)
    }
  }, [isValidToSimulate, querySimulate, variables])

  useEffect(() => {
    fetchSimulatedData()
  }, [fetchSimulatedData])

  const { simulatedAmount, spread, commission, price } = useMemo(() => {
    const simulatedAmount = !reverse
      ? result?.return_amount
      : result?.offer_amount
    const spread = result?.spread_amount
    const commission = result?.commission_amount
    const price = !reverse
      ? div(amount, simulatedAmount)
      : div(simulatedAmount, amount)
    return { simulatedAmount, spread, commission, price }
  }, [amount, result, reverse])

  useEffect(() => {
    isError
      ? setSimulated(undefined)
      : simulatedAmount &&
        spread &&
        commission &&
        price &&
        setSimulated({ amount: simulatedAmount, spread, commission, price })
  }, [simulatedAmount, spread, commission, price, error, isError])
  return { ...result, simulating: isLoading, simulated, error }
}
export default useSwapSimulate
