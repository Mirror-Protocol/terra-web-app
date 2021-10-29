import { MsgExecuteContract } from "@terra-money/terra.js"
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

function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t))
}

const useAutoRouter = (params: Params) => {
  const { from, to, type, amount } = params
  // const amount = 1;
  const { generateContractMessages, querySimulate } = useAPI()
  const [isLoading, setIsLoading] = useState(false)
  const [msgs, setMsgs] = useState<
    (MsgExecuteContract[] | MsgExecuteContract)[]
  >([])
  const [simulatedAmounts, setSimulatedAmounts] = useState<number[]>([])
  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)
  const profitableQuery = useMemo(() => {
    if (simulatedAmounts?.length > 0) {
      const index = simulatedAmounts.indexOf(
        Math.max(...simulatedAmounts.map((item) => (!item ? -1 : item)))
      )
      const simulatedAmount = simulatedAmounts[index]
      if (simulatedAmount < 0) {
        return undefined
      }
      const msg = msgs[index]
      const execute_msg = (Array.isArray(msg) ? msg[0] : msg)
        ?.execute_msg as any
      const token_route: string[] = []
      if (execute_msg?.execute_swap_operations?.operations) {
        const operations: any[] =
          execute_msg?.execute_swap_operations?.operations
        if (operations) {
          operations.forEach((operation, index) => {
            if (operation?.terra_swap?.offer_asset_info?.native_token?.denom) {
              token_route.push(
                operation?.terra_swap?.offer_asset_info?.native_token?.denom
              )
            } else if (
              operation?.terra_swap?.offer_asset_info?.token?.contract_addr
            ) {
              token_route.push(
                operation?.terra_swap?.offer_asset_info?.token?.contract_addr
              )
            } else if (operation?.native_swap?.offer_denom) {
              token_route.push(operation?.native_swap?.offer_denom)
            }

            if (index >= operations.length - 1) {
              if (operation?.terra_swap?.ask_asset_info?.native_token?.denom) {
                token_route.push(
                  operation?.terra_swap?.ask_asset_info?.native_token?.denom
                )
              } else if (
                operation?.terra_swap?.ask_asset_info?.token?.contract_addr
              ) {
                token_route.push(
                  operation?.terra_swap?.ask_asset_info?.token?.contract_addr
                )
              } else if (operation?.native_swap?.ask_denom) {
                token_route.push(operation?.native_swap?.ask_denom)
              }
            }
          })
        }
      }
      return {
        msg,
        index,
        simulatedAmount,
        token_route,
        price: div(amount, simulatedAmount),
      }
    }
    return undefined
  }, [amount, msgs, simulatedAmounts])

  useEffect(() => {
    console.log("profitableQuery")
    console.log(profitableQuery)
  }, [profitableQuery])
  useEffect(() => {
    console.log("simulatedAmounts")
    console.log(JSON.parse(JSON.stringify(simulatedAmounts)))
  }, [simulatedAmounts])
  useEffect(() => {
    console.log("msgs")
    console.log(msgs)
  }, [msgs])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!from || !to || !amount) {
        return
      }
      if (type === Type.PROVIDE || type === Type.WITHDRAW) {
        return
      }
      console.log("fetchMessages")
      console.log({ amount, from, to })
      const res: MsgExecuteContract[] = await generateContractMessages({
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
    }
    setIsLoading(true)
    setMsgs([])
    setSimulatedAmounts([])
    const timerId = setTimeout(() => {
      fetchMessages()
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [amount, from, generateContractMessages, to, type, autoRefreshTicker])

  useEffect(() => {
    const timerId = setInterval(() => {
      if (window?.navigator?.onLine && window?.document?.hasFocus()) {
        setAutoRefreshTicker((current) => !current)
      }
    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  }, [amount, from, to, type])

  useEffect(() => {
    const request = async () => {
      const simulateQueries = msgs.map((msg) => {
        let { contract, execute_msg } = (Array.isArray(msg)
          ? msg[0]
          : msg) as any

        if (execute_msg?.send) {
          contract = execute_msg?.send?.contract
          execute_msg = execute_msg?.send?.msg
        }
        console.log("contract")
        console.log(contract)
        console.log("execute_msg")
        console.log(execute_msg)
        if (execute_msg?.execute_swap_operations) {
          const { operations } = execute_msg.execute_swap_operations
          console.log("operations")
          console.log(operations)
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

      const result: any[] = []
      simulateQueries.forEach(async (query, index) => {
        await sleep(100 * index)
        const res = await querySimulate({
          contract: `${query?.contract}`,
          msg: query?.msg,
        })
        if (res) {
          result[index] = res
        }

        if (index >= simulateQueries.length - 1) {
          setSimulatedAmounts(
            result
              .map((item) => {
                if (item?.result?.return_amount) {
                  return parseInt(item?.result?.return_amount, 10)
                }
                if (item?.result?.amount) {
                  return parseInt(item?.result?.amount, 10)
                }
                return -1
              })
              .map((item) => (Number.isNaN(item) ? -1 : item))
          )
          setIsLoading(false)
        }
      })

      // const res = await Promise.all(
      //   simulateQueries.map((query) =>
      //     querySimulate({
      //       contract: `${query?.contract}`,
      //       msg: query?.msg,
      //     })
      //   )
      // );
    }

    setSimulatedAmounts([])
    request()
  }, [amount, msgs, querySimulate])

  return {
    isLoading,
    profitableQuery,
  }
}

export default useAutoRouter
