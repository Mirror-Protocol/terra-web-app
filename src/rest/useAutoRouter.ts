import { Coins, MsgExecuteContract, Numeric } from "@terra-money/terra.js"
import { useAddress, useContract } from "hooks"
import { div, times } from "libs/math"
import { decimal, toAmount } from "libs/parse"
import { Type } from "pages/Swap"
import { useCallback, useEffect, useMemo, useState } from "react"
import useAPI from "./useAPI"
import { useTokenInfos } from "./usePairs"
import { useLCDClient } from "layouts/WalletConnectProvider"
import { useContractsAddress } from "hooks/useContractsAddress"
import calc from "helpers/calc"
import { AssetInfoKey } from "hooks/contractKeys"
import useBalance from "./useBalance"

type Params = {
  from: string
  to: string
  value: number | string
  type?: Type
  slippageTolerance?: string | number
  deadline: number | undefined
}

function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t))
}

const useAutoRouter = (params: Params) => {
  const { from, to, type, value: _value, slippageTolerance, deadline } = params
  const walletAddress = useAddress()
  const { terra } = useLCDClient()
  const value = Number(_value)
  const { balance } = useBalance(from)
  const { generateContractMessages, querySimulate } = useAPI()
  const [isSimulationLoading, setIsSimulationLoading] = useState(false)
  const [isQueryValidationLoading, setIsQueryValidationLoading] =
    useState(false)
  const isLoading = isSimulationLoading || isQueryValidationLoading

  const [msgs, setMsgs] = useState<
    (MsgExecuteContract[] | MsgExecuteContract)[]
  >([])
  const [simulatedAmounts, setSimulatedAmounts] = useState<number[]>([])
  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)
  const { isNativeToken } = useContractsAddress()
  const { find } = useContract()
  const tokenInfos = useTokenInfos()

  const getMsgs = useCallback(
    (
      _msg: any,
      {
        amount,
        token,
        minimumReceived,
        beliefPrice,
      }: {
        amount?: string | number
        token?: string
        minimumReceived?: string | number
        beliefPrice?: string | number
      }
    ) => {
      const msg = Array.isArray(_msg) ? _msg[0] : _msg

      if (msg?.execute_msg?.swap) {
        msg.execute_msg.swap.belief_price = `${beliefPrice}`
      }
      if (msg?.execute_msg?.send?.msg?.swap) {
        msg.execute_msg.send.msg.swap.belief_price = `${beliefPrice}`
      }
      if (msg?.execute_msg?.send?.msg?.execute_swap_operations) {
        msg.execute_msg.send.msg.execute_swap_operations.minimum_receive =
          parseInt(`${minimumReceived}`, 10).toString()
        if (isNativeToken(token || "")) {
          msg.coins = Coins.fromString(toAmount(`${amount}`, token) + token)
        }

        msg.execute_msg.send.msg = btoa(
          JSON.stringify(msg.execute_msg.send.msg)
        )
      } else if (msg?.execute_msg?.send?.msg) {
        msg.execute_msg.send.msg = btoa(
          JSON.stringify(msg.execute_msg.send.msg)
        )
      }
      if (msg?.execute_msg?.execute_swap_operations) {
        msg.execute_msg.execute_swap_operations.minimum_receive = parseInt(
          `${minimumReceived}`,
          10
        ).toString()
        msg.execute_msg.execute_swap_operations.offer_amount = toAmount(
          `${amount}`,
          token
        )

        if (isNativeToken(token || "")) {
          msg.coins = Coins.fromString(toAmount(`${amount}`, token) + token)
        }
      }
      return [msg]
    },
    [isNativeToken]
  )

  const queries = useMemo(() => {
    if (!to || !value || !simulatedAmounts?.length) {
      return []
    }

    const indexes = simulatedAmounts
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .map((item) => item.index)

    return indexes.map((index) => {
      const simulatedAmount = simulatedAmounts[index]
      if (simulatedAmount < 0) {
        return null
      }
      const msg = msgs[index]
      const execute_msg = (Array.isArray(msg) ? msg[0] : msg)
        ?.execute_msg as any
      const tokenRoutes: string[] = []
      const operations: any[] =
        execute_msg?.execute_swap_operations?.operations ||
        execute_msg?.send?.msg?.execute_swap_operations?.operations
      if (operations) {
        operations.forEach((operation, index) => {
          if (operation?.terra_swap?.offer_asset_info?.native_token?.denom) {
            tokenRoutes.push(
              operation?.terra_swap?.offer_asset_info?.native_token?.denom
            )
          } else if (
            operation?.terra_swap?.offer_asset_info?.token?.contract_addr
          ) {
            tokenRoutes.push(
              operation?.terra_swap?.offer_asset_info?.token?.contract_addr
            )
          } else if (operation?.native_swap?.offer_denom) {
            tokenRoutes.push(operation?.native_swap?.offer_denom)
          }

          if (index >= operations.length - 1) {
            if (operation?.terra_swap?.ask_asset_info?.native_token?.denom) {
              tokenRoutes.push(
                operation?.terra_swap?.ask_asset_info?.native_token?.denom
              )
            } else if (
              operation?.terra_swap?.ask_asset_info?.token?.contract_addr
            ) {
              tokenRoutes.push(
                operation?.terra_swap?.ask_asset_info?.token?.contract_addr
              )
            } else if (operation?.native_swap?.ask_denom) {
              tokenRoutes.push(operation?.native_swap?.ask_denom)
            }
          }
        })
      }

      const tokenInfo1 = tokenInfos.get(from)
      const tokenInfo2 = tokenInfos.get(to)

      const minimumReceived = calc.minimumReceived({
        expectedAmount: `${simulatedAmount}`,
        max_spread: String(slippageTolerance),
        commission: find(AssetInfoKey.COMMISSION, to),
        decimals: tokenInfo1?.decimals,
      })

      const e = Math.pow(10, tokenInfo2?.decimals || 6)

      const formattedMsg = getMsgs(msg, {
        amount: value,
        minimumReceived,
        token: from,
        beliefPrice: `${decimal(div(times(value, e), simulatedAmount), 18)}`,
      })

      return {
        msg: formattedMsg,
        index,
        simulatedAmount,
        tokenRoutes,
        price: div(times(value, e), simulatedAmount),
      }
    })
  }, [
    to,
    value,
    simulatedAmounts,
    msgs,
    slippageTolerance,
    find,
    getMsgs,
    from,
    tokenInfos,
  ])

  useEffect(() => {
    let isCanceled = false
    const fetchMessages = async () => {
      if (!from || !to || !value || !type) {
        return
      }
      if (type === Type.PROVIDE || type === Type.WITHDRAW) {
        return
      }

      const res: MsgExecuteContract[] = await generateContractMessages({
        type: Type.SWAP,
        from,
        to,
        amount: value,
        max_spread: `${slippageTolerance || 0.01}`,
        belief_price: 0,
        sender: walletAddress,
        deadline,
      })
      if (Array.isArray(res) && !isCanceled) {
        setMsgs(res)
      }
    }
    setIsSimulationLoading(true)
    setIsQueryValidationLoading(true)
    setMsgs([])
    setSimulatedAmounts([])
    const timerId = setTimeout(() => {
      fetchMessages()
    }, 500)

    return () => {
      clearTimeout(timerId)
      isCanceled = true
    }
  }, [
    value,
    from,
    generateContractMessages,
    to,
    type,
    autoRefreshTicker,
    walletAddress,
    slippageTolerance,
    deadline,
  ])

  useEffect(() => {
    const timerId = setInterval(() => {
      if (
        window?.navigator?.onLine &&
        window?.document?.hasFocus() &&
        !isSimulationLoading
      ) {
        setAutoRefreshTicker((current) => !current)
      }
    }, 60000)
    return () => {
      clearInterval(timerId)
    }
  }, [value, from, to, type, isSimulationLoading])

  useEffect(() => {
    let isCanceled = false
    const request = async () => {
      const simulateQueries = msgs.map((msg) => {
        let { contract, execute_msg } = (
          Array.isArray(msg) ? msg[0] : msg
        ) as any

        if (execute_msg?.send) {
          contract = execute_msg?.send?.contract
          execute_msg = execute_msg?.send?.msg
        }
        if (execute_msg?.execute_swap_operations) {
          const { operations } = execute_msg.execute_swap_operations
          return {
            contract,
            msg: {
              simulate_swap_operations: {
                offer_amount: toAmount(`${value}`, from),
                operations,
              },
            },
          }
        }
        if (execute_msg?.swap) {
          const offer_asset = execute_msg?.swap?.offer_asset || {
            amount: toAmount(`${value}`, from),
            info: {
              token: {
                contract_addr: from,
              },
            },
          }

          return {
            contract,
            msg: {
              simulation: { offer_asset },
            },
          }
        }
        return undefined
      })

      const promises = simulateQueries.map(async (query, index) => {
        try {
          if (isCanceled) {
            return undefined
          }
          await sleep(80 * index)
          if (isCanceled) {
            return undefined
          }
          const res = await querySimulate({
            contract: `${query?.contract}`,
            msg: query?.msg,
            timeout: 5000,
          })
          if (isCanceled) {
            return undefined
          }

          return res
        } catch (error) {
          console.log(error)
        }
        return undefined
      })

      const results = await Promise.allSettled(promises)
      if (isCanceled) {
        return
      }
      setSimulatedAmounts(
        results
          .map((item) => {
            if (item.status === "fulfilled") {
              if (item?.value?.return_amount) {
                return parseInt(item?.value?.return_amount, 10)
              }
              if (item?.value?.amount) {
                return parseInt(item?.value?.amount, 10)
              }
            }
            return -1
          })
          .map((item) => (Number.isNaN(Number(item)) ? -1 : item))
      )
      setIsSimulationLoading(false)
    }

    setSimulatedAmounts([])
    request()

    return () => {
      isCanceled = true
    }
  }, [value, from, msgs, querySimulate])

  const [profitableQuery, setProfitableQuery] = useState(queries[0])

  useEffect(() => {
    let isCanceled = false
    const validateQueries = async () => {
      if (!queries?.length) {
        return
      }
      setIsQueryValidationLoading(true)
      const account = walletAddress
        ? await terra.auth.accountInfo(walletAddress)
        : undefined
      if (isCanceled) {
        return
      }

      if (
        !account ||
        Numeric.parse(balance || "0").lt(toAmount(`${value}`, from))
      ) {
        setProfitableQuery(queries[0])
      } else {
        for await (const query of queries) {
          try {
            if (query?.msg) {
              await terra.tx.estimateFee(
                [
                  {
                    sequenceNumber: account.getSequenceNumber(),
                    publicKey: account.getPublicKey(),
                  },
                ],
                {
                  msgs: query?.msg,
                  memo: undefined,
                }
              )
              if (isCanceled) {
                return
              }
              setProfitableQuery(query)
              break
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
      setIsQueryValidationLoading(false)
    }
    const timerId = setTimeout(() => {
      validateQueries()
    }, 300)
    return () => {
      isCanceled = true
      clearTimeout(timerId)
    }
  }, [value, balance, queries, terra, walletAddress, from])

  const result = useMemo(() => {
    if (!from || !to || !type || !value) {
      return { profitableQuery: undefined, isLoading }
    }
    return {
      isLoading,
      profitableQuery,
    }
  }, [value, from, isLoading, profitableQuery, to, type])

  return result
}

export default useAutoRouter
