import { Msg } from "@terra-money/terra.js"
import { div } from "libs/math"
import { toAmount } from "libs/parse"
import { Type } from "pages/Swap"
import { useEffect, useMemo, useState } from "react"
import useAPI from "./useAPI"

type Params = {
  from: string
  to: string
  amount: number | string
  type?: Type
}

const useAutoRouter = (params: Params) => {
  const { from, to, type } = params
  const amount = 1
  const { generateContractMessages, querySimulate } = useAPI()
  const [isLoading, setIsLoading] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [simulatedAmounts, setSimulatedAmounts] = useState<number[]>([])
  const profitableQuery = useMemo(() => {
    if (simulatedAmounts?.length > 0) {
      const index = simulatedAmounts.indexOf(Math.max(...simulatedAmounts))
      const simulatedAmount = simulatedAmounts[index]
      return {
        msg: msgs[index],
        index,
        simulatedAmount,
        price: div(amount, simulatedAmount),
      }
    }
    return undefined
  }, [msgs, simulatedAmounts])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!from || !to || !amount) {
        return
      }
      if (type === Type.PROVIDE || type === Type.WITHDRAW) {
        return undefined
      }
      const res: Msg[] = await generateContractMessages({
        type: Type.SWAP,
        amount,
        from,
        to,
        sender: "-",
        max_spread: 0,
        belief_price: 0,
      })
      if (Array.isArray(res)) {
        setMsgs(res)
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    setMsgs([])

    const timerId = setTimeout(() => {
      fetchMessages()
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [amount, from, generateContractMessages, to, type])

  useEffect(() => {
    const request = async () => {
      const simulateQueries = msgs.map((msg) => {
        const { contract, execute_msg } = Array.isArray(msg) ? msg[0] : msg
        if (execute_msg?.execute_swap_operations) {
          const { operations } = execute_msg.execute_swap_operations
          return {
            contract,
            msg: {
              simulate_swap_operations: {
                offer_amount: toAmount(`${amount}`),
                operations,
              },
            },
          }
        }
        if (execute_msg?.swap) {
          const { offer_asset } = execute_msg.swap
          return {
            contract,
            msg: {
              simulation: { offer_asset },
            },
          }
        }
        return undefined
      })

      const res = await Promise.all(
        simulateQueries.map((query) =>
          querySimulate({
            contract: `${query?.contract}`,
            msg: query?.msg,
          })
        )
      )
      setSimulatedAmounts(
        res.map((item) => {
          if (item?.result?.return_amount) {
            return parseInt(item?.result?.return_amount)
          }
          if (item?.result?.amount) {
            return parseInt(item?.result?.amount)
          }
          return -1
        })
      )
    }

    request()
  }, [amount, msgs, querySimulate])

  return {
    isLoading,
    profitableQuery,
  }
}

export default useAutoRouter
