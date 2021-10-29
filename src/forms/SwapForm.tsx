import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import Container from "components/Container"
import { useForm } from "react-hook-form"
import Result from "./Result"
import TabView from "components/TabView"
import { useLocation } from "react-router-dom"
import { LP, LUNA, DEFAULT_MAX_SPREAD, ULUNA } from "constants/constants"
import {
  useNetwork,
  useContractsAddress,
  useContract,
  useAddress,
  useConnectModal,
} from "hooks"
import { lookup, decimal, toAmount } from "libs/parse"
import calc from "helpers/calc"
import { PriceKey, BalanceKey, AssetInfoKey } from "hooks/contractKeys"
import Count from "components/Count"
import {
  validate as v,
  placeholder,
  step,
  renderBalance,
  calcTax,
} from "./formHelpers"
// import useSwapSimulate from "rest/useSwapSimulate";
import useSwapSelectToken from "./useSwapSelectToken"
import SwapFormGroup from "./SwapFormGroup"
import usePairs, { tokenInfos, lpTokenInfos, InitLP } from "rest/usePairs"
import useBalance from "rest/useBalance"
import { minus, gte, times, ceil, div } from "libs/math"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"
import useGasPrice from "rest/useGasPrice"
import { hasTaxToken } from "helpers/token"
import { Coin, Coins, StdFee, CreateTxOptions } from "@terra-money/terra.js"
import { Type } from "pages/Swap"
import usePool from "rest/usePool"
import { insertIf } from "libs/utils"
import { percent } from "libs/num"
import SvgArrow from "images/arrow.svg"
import SvgPlus from "images/plus.svg"
import Button from "components/Button"
import MESSAGE from "lang/MESSAGE.json"
import SwapConfirm from "./SwapConfirm"
import useAPI from "rest/useAPI"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import iconSettings from "images/icon-settings.svg"
import iconReload from "images/icon-reload.svg"
import { useModal } from "components/Modal"
import Settings, { SettingValues } from "components/Settings"
import useLocalStorage from "libs/useLocalStorage"
import useAutoRouter from "rest/useAutoRouter"

enum Key {
  token1 = "token1",
  token2 = "token2",
  value1 = "value1",
  value2 = "value2",
  feeValue = "feeValue",
  feeSymbol = "feeSymbol",
  load = "load",
  symbol1 = "symbol1",
  symbol2 = "symbol2",
  max1 = "max1",
  max2 = "max2",
  maxFee = "maxFee",
  gasPrice = "gasPrice",
  taxCap = "taxCap",
  taxRate = "taxRate",
  poolLoading = "poolLoading",
}

const priceKey = PriceKey.PAIR
const infoKey = AssetInfoKey.COMMISSION

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  margin-top: 60px;
`

const SwapForm = ({ type, tabs }: { type: Type; tabs: TabViewProps }) => {
  const connectModal = useConnectModal()
  const { getSymbol, isNativeToken } = useContractsAddress()
  const { loadTaxInfo, loadTaxRate, generateContractMessages } = useAPI()
  const { state } = useLocation<{ symbol: string }>()
  const { fee } = useNetwork()
  const { find } = useContract()
  const walletAddress = useAddress()
  const { post: terraExtensionPost } = useWallet()
  const settingsModal = useModal()
  const [slippageSettings, setSlippageSettings] = useLocalStorage<
    SettingValues
  >("slippage", {
    slippage: `${DEFAULT_MAX_SPREAD}`,
    custom: "",
  })
  const slippageTolerance = useMemo(() => {
    // 1% = 0.01
    return `${(
      parseFloat(
        (slippageSettings?.slippage === "custom"
          ? slippageSettings.custom
          : slippageSettings.slippage) || `${DEFAULT_MAX_SPREAD}`
      ) / 100
    ).toFixed(3)}`
  }, [slippageSettings])

  const { pairs } = usePairs()
  const balanceKey = {
    [Type.SWAP]: BalanceKey.TOKEN,
    [Type.PROVIDE]: BalanceKey.TOKEN,
    [Type.WITHDRAW]: BalanceKey.LPSTAKABLE,
  }[type]

  const form = useForm({
    defaultValues: {
      [Key.value1]: "",
      [Key.value2]: "",
      [Key.token1]: type !== Type.WITHDRAW ? state?.symbol ?? ULUNA : InitLP,
      [Key.token2]: state?.symbol ?? "",
      [Key.feeValue]: "",
      [Key.feeSymbol]: LUNA,
      [Key.load]: "",
      [Key.symbol1]: "",
      [Key.symbol2]: "",
      [Key.max1]: "",
      [Key.max2]: "",
      [Key.maxFee]: "",
      [Key.gasPrice]: "",
      [Key.poolLoading]: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  })
  const { register, watch, setValue, setFocus, formState, trigger } = form
  const [isReversed, setIsReversed] = useState(false)
  const formData = watch()

  const handleToken1Select = (token: string) => {
    setValue(Key.token1, token)
    if (!formData[Key.value1]) {
      setFocus(Key.value1)
    }
  }
  const handleToken2Select = (token: string) => {
    setValue(Key.token2, token)
    if (!formData[Key.value2]) {
      setFocus(Key.value2)
    }
  }

  const tokenInfo1 = useMemo(() => {
    return tokenInfos.get(formData[Key.token1])
  }, [formData])

  const tokenInfo2 = useMemo(() => {
    return tokenInfos.get(formData[Key.token2])
  }, [formData])

  const { balance: balance1 } = useBalance(
    formData[Key.token1],
    formData[Key.symbol1]
  )
  const { balance: balance2 } = useBalance(
    formData[Key.token2],
    formData[Key.symbol2]
  )
  const { balance: maxFeeBalance } = useBalance(
    tokenInfos.get(formData[Key.feeSymbol])?.contract_addr || "",
    formData[Key.feeSymbol]
  )

  const selectToken1 = useSwapSelectToken(
    {
      value: formData[Key.token1],
      symbol: formData[Key.symbol1],
      onSelect: handleToken1Select,
      priceKey,
      balanceKey,
      isFrom: true,
      oppositeValue: formData[Key.token2],
      onSelectOpposite: handleToken2Select,
    },
    pairs,
    type
  )

  const selectToken2 = useSwapSelectToken(
    {
      value: formData[Key.token2],
      symbol: formData[Key.symbol2],
      onSelect: handleToken2Select,
      priceKey,
      balanceKey,
      isFrom: false,
      oppositeValue: formData[Key.token1],
      onSelectOpposite: handleToken1Select,
    },
    pairs,
    type
  )

  const { pair, lpContract, poolSymbol1, poolSymbol2 } = useMemo(() => {
    const info1 =
      type === Type.WITHDRAW
        ? lpTokenInfos.get(formData[Key.token1])?.[0]
        : tokenInfo1
    const info2 =
      type === Type.WITHDRAW
        ? lpTokenInfos.get(formData[Key.token1])?.[1]
        : tokenInfo2

    const selected = pairs.find((item) => {
      return (
        item.pair.find((s) => s.contract_addr === info1?.contract_addr) &&
        item.pair.find((s) => s.contract_addr === info2?.contract_addr)
      )
    })

    const contract = selected?.contract || ""
    const lpContract = selected?.liquidity_token || ""
    const lpTokenInfo = lpTokenInfos.get(lpContract)

    return {
      pair: contract,
      lpContract,
      poolSymbol1: lpTokenInfo?.[0]?.symbol,
      poolSymbol2: lpTokenInfo?.[1]?.symbol,
    }
  }, [formData, pairs, tokenInfo1, tokenInfo2, type])

  const { isLoading: isAutoRouterLoading, profitableQuery } = useAutoRouter({
    from: formData[Key.token1],
    to: formData[Key.token2],
    amount: formData[Key.value1],
    type: formState.isSubmitted ? undefined : type,
  })

  // const simulation = useSwapSimulate({
  //   amount: toAmount(formData[!isReversed ? Key.value1 : Key.value2]),
  //   token: formData[!isReversed ? Key.token1 : Key.token2],
  //   pair,
  //   reverse: isReversed,
  // });
  // const {
  //   simulated: simulatedData,
  //   simulating: isSimulating,
  //   error: simulationError,
  // } = simulation;

  const { result: poolResult, poolLoading } = usePool(
    pair,
    formData[Key.symbol1],
    formData[Key.value1],
    type,
    balance1
  )

  const simulationContents = useMemo(() => {
    if (
      !(
        formData[Key.value1] &&
        formData[Key.symbol1] &&
        formData[Key.value2] &&
        (type !== Type.WITHDRAW ? formData[Key.symbol2] : true)
      )
    ) {
      return []
    }

    const minimumReceived = profitableQuery
      ? calc.minimumReceived({
          offer_amount: toAmount(formData[Key.value1]),
          belief_price: decimal(times(profitableQuery?.price, 1000000), 18),
          max_spread: String(slippageTolerance),
          commission: find(infoKey, formData[Key.symbol2]),
        })
      : "0"

    return [
      ...insertIf(type === Type.SWAP, {
        title: <TooltipIcon content={Tooltip.Swap.Rate}>Rate</TooltipIcon>,
        content: `${decimal(times(profitableQuery?.price, 1000000), 6)} ${
          formData[Key.symbol1]
        } per ${formData[Key.symbol2]}`,
      }),
      ...insertIf(type !== Type.SWAP, {
        title: `${formData[Key.symbol1]} price`,
        content: `${poolResult && decimal(poolResult.price1, 6)} ${
          formData[Key.symbol1]
        } per LP`,
      }),
      ...insertIf(type !== Type.SWAP, {
        title: `${formData[Key.symbol2]} price`,
        content: `${poolResult && decimal(poolResult.price2, 6)} ${
          formData[Key.symbol2]
        } per LP`,
      }),
      ...insertIf(type === Type.SWAP, {
        title: (
          <TooltipIcon content={Tooltip.Swap.MinimumReceived}>
            Minimum Received
          </TooltipIcon>
        ),
        content: (
          <Count symbol={formData[Key.symbol2]}>{minimumReceived}</Count>
        ),
      }),
      // ...insertIf(type === Type.SWAP, {
      //   title: (
      //     <TooltipIcon content={Tooltip.Swap.TradingFee}>
      //       Trading Fee
      //     </TooltipIcon>
      //   ),
      //   content: (
      //     <Count symbol={formData[Key.symbol2]}>
      //       {find(infoKey, formData[Key.symbol2])}
      //     </Count>
      //   ),
      // }),
      ...insertIf(type === Type.PROVIDE, {
        title: (
          <TooltipIcon content={Tooltip.Pool.LPfromTx}>LP from Tx</TooltipIcon>
        ),
        content: `${lookup(poolResult?.LP, LP)} LP`,
      }),
      ...insertIf(type === Type.WITHDRAW, {
        title: "LP after Tx",
        content: `${lookup(poolResult?.LP, LP)} LP`,
      }),
      ...insertIf(type !== Type.SWAP, {
        title: (
          <TooltipIcon content={Tooltip.Pool.PoolShare}>
            Pool Share after Tx
          </TooltipIcon>
        ),
        content: (
          <Count format={(value) => `${percent(value)}`}>
            {poolResult?.afterPool}
          </Count>
        ),
      }),
      {
        title: <TooltipIcon content={Tooltip.Swap.TxFee}>Tx Fee</TooltipIcon>,
        content: (
          <Count symbol={formData[Key.feeSymbol]}>
            {lookup(formData[Key.feeValue])}
          </Count>
        ),
      },
      ...insertIf(type === Type.SWAP && profitableQuery?.token_route?.length, {
        title: (
          <TooltipIcon content="Optimized route for your optimal gain">
            Route
          </TooltipIcon>
        ),
        content: profitableQuery?.token_route?.map((token, index, array) => (
          <>
            {tokenInfos.get(token)?.symbol}
            {index >= array.length - 1 ? "" : " → "}
          </>
        )),
      }),
    ]
  }, [find, formData, poolResult, profitableQuery, slippageTolerance, type])

  const getMsgs = useCallback(
    (
      _msg: any,
      {
        amount,
        symbol,
        minimumReceived,
      }: {
        amount?: string | number
        symbol?: string
        minimumReceived?: string | number
      }
    ) => {
      console.log(_msg)
      console.log("symbol")
      console.log(symbol)
      const msg = Array.isArray(_msg) ? _msg[0] : _msg
      console.log(msg)
      if (msg?.execute_msg?.send?.msg?.execute_swap_operations) {
        msg.execute_msg.send.msg.execute_swap_operations.minimum_receive = parseInt(
          `${minimumReceived}`,
          10
        ).toString()
        // msg.execute_msg.send.msg.execute_swap_operations.offer_amount = toAmount(
        //   `${amount}`
        // );
        if (isNativeToken(symbol || "")) {
          msg.coins = Coins.fromString(toAmount(`${amount}`) + symbol)
        }
      }
      if (msg?.execute_msg?.execute_swap_operations) {
        msg.execute_msg.execute_swap_operations.minimum_receive = parseInt(
          `${minimumReceived}`,
          10
        ).toString()
        msg.execute_msg.execute_swap_operations.offer_amount = toAmount(
          `${amount}`
        )

        if (isNativeToken(symbol || "")) {
          msg.coins = Coins.fromString(toAmount(`${amount}`) + symbol)
        }
      }
      return [msg]
    },
    [isNativeToken]
  )

  const { gasPrice } = useGasPrice(formData[Key.feeSymbol])
  const getTax = useCallback(
    async ({ symbol1, symbol2, value1, value2, max1, max2 }) => {
      let newTax = "0"

      const taxCap1 = await loadTaxInfo(symbol1)
      const taxCap2 = await loadTaxInfo(symbol2)
      const taxRate = await loadTaxRate()
      if (hasTaxToken(getSymbol(symbol1)) && taxCap1 && taxRate && max1) {
        const tax1 = calcTax(toAmount(value1), taxCap1, taxRate)
        newTax =
          newTax === "0"
            ? tax1 + getSymbol(symbol1)
            : newTax + "," + tax1 + getSymbol(symbol1)
      }
      if (
        type === Type.PROVIDE &&
        hasTaxToken(getSymbol(symbol2)) &&
        taxCap2 &&
        taxRate &&
        max2
      ) {
        const tax2 = calcTax(toAmount(value2), taxCap2, taxRate)
        newTax =
          newTax === "0"
            ? tax2 + getSymbol(symbol2)
            : newTax + "," + tax2 + getSymbol(symbol2)
      }
      return newTax
    },
    [getSymbol, loadTaxInfo, loadTaxRate, type]
  )

  const [tax, setTax] = useState("")
  const isTaxCalculating = useRef<boolean>(false)
  useEffect(() => {
    if (isTaxCalculating?.current) {
      return
    }
    isTaxCalculating.current = true
    getTax({
      symbol1: formData[Key.symbol1],
      symbol2: formData[Key.symbol2],
      value1: formData[Key.value1],
      value2: formData[Key.value2],
      max1: formData[Key.max1],
      max2: formData[Key.max2],
    })
      .then((value) => {
        setTax(value)
      })
      .catch(() => {
        setTax("")
      })
      .finally(() => {
        isTaxCalculating.current = false
      })
  }, [formData, getTax])

  const validateForm = async (
    key:
      | Key.value1
      | Key.value2
      | Key.token1
      | Key.token2
      | Key.feeValue
      | Key.feeSymbol
      | Key.load,
    newValues?: Partial<typeof formData>
  ) => {
    const {
      value1,
      value2,
      symbol1,
      symbol2,
      max1,
      max2,
      feeValue,
      feeSymbol,
      maxFee,
    } = { ...formData, ...(newValues || {}) }

    console.log("validateForm")
    console.log({
      value1,
      value2,
      symbol1,
      symbol2,
      max1,
      max2,
      feeValue,
      feeSymbol,
      maxFee,
    })

    if (key === Key.value1) {
      const taxCap = await loadTaxInfo(symbol1)
      const taxRate = await loadTaxRate()
      return (
        v.amount(value1, {
          symbol: symbol1,
          max: max1,
          refvalue: value2,
          refsymbol: symbol2,
          isFrom: true,
          feeValue,
          feeSymbol,
          maxFee,
          taxCap,
          taxRate,
          type,
        }) || true
      )
    }

    if (key === Key.value2) {
      if (!symbol2) {
        return true
      }
      if (type !== Type.WITHDRAW) {
        return (
          v.amount(value2, {
            symbol: symbol2,
            max: max2,
            refvalue: value1,
            refsymbol: symbol1,
            isFrom: false,
            feeValue: "0",
            feeSymbol,
            maxFee: "0",
            type,
          }) || true
        )
      }
      if (isReversed || type === Type.WITHDRAW) {
        return v.required(value2) || true
      }
    }
    return true
  }

  useEffect(() => {
    setValue(
      Key.token1,
      type !== Type.WITHDRAW ? state?.symbol ?? ULUNA : InitLP
    )

    if (type === Type.WITHDRAW) {
      setValue(Key.token2, "")
      setValue(Key.value2, "")
    }
  }, [type, setValue, state])

  useEffect(() => {
    setValue(Key.symbol1, tokenInfo1?.symbol || "")
  }, [setValue, tokenInfo1])

  useEffect(() => {
    console.log(tokenInfo2?.symbol)
    setValue(Key.symbol2, tokenInfo2?.symbol || "")
  }, [setValue, tokenInfo2])

  useEffect(() => {
    setValue(Key.max1, balance1 || "")
  }, [balance1, setValue])

  useEffect(() => {
    setValue(Key.max2, balance2 || "")
  }, [balance2, setValue])

  useEffect(() => {
    setValue(Key.maxFee, maxFeeBalance || "")
  }, [maxFeeBalance, setValue])

  const watchCallback = useCallback(
    (data, { name: watchName, value: watchValue, type: eventType }) => {
      console.log(watchName, watchValue, eventType)
      console.log(data)
      console.log(tokenInfos.get(data.token2)?.symbol)
      if (!eventType && [Key.value1, Key.value2].includes(watchName as Key)) {
        return
      }
      if (type === Type.SWAP) {
        if (
          [Key.value1, Key.token1, Key.token2, Key.feeSymbol].includes(
            watchName as Key
          )
        ) {
          console.log("hello")
          console.log(profitableQuery)
          // console.log(
          //   lookup(
          //     times(
          //       `${profitableQuery?.simulatedAmount}`,
          //       `${data[Key.value1]}`
          //     ),
          //     tokenInfos.get(data.token2)?.symbol
          //   )
          // );
          // setValue(
          //   Key.value2,
          //   lookup(
          //     times(
          //       `${profitableQuery?.simulatedAmount}`,
          //       `${data[Key.value1]}`
          //     ),
          //     tokenInfos.get(data.token2)?.symbol
          //   )
          // );
          console.log(
            lookup(
              `${profitableQuery?.simulatedAmount}`,
              tokenInfos.get(data.token2)?.symbol
            )
          )
          setValue(
            Key.value2,
            lookup(
              `${profitableQuery?.simulatedAmount}`,
              tokenInfos.get(data.token2)?.symbol
            )
          )
          trigger(Key.value2)
        }
        if (watchName === Key.value2) {
          setValue(
            Key.value1,
            lookup(
              div(
                toAmount(`${data[Key.value2]}`),
                `${profitableQuery?.simulatedAmount}`
              )
            )
          )
          trigger(Key.value1)
        }
      }
    },
    [profitableQuery, setValue, trigger, type]
  )

  useEffect(() => {
    if (profitableQuery) {
      console.log("profitableQuery changed")
      console.log(profitableQuery)
      watchCallback(form.getValues(), { name: Key.token2 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitableQuery, watchCallback])

  useEffect(() => {
    const subscription = watch(watchCallback)
    return () => subscription.unsubscribe()
  }, [watch, watchCallback, profitableQuery])

  useEffect(() => {
    switch (type) {
      case Type.SWAP:
        // const key = isReversed ? Key.value1 : Key.value2;
        // const symbol = isReversed ? tokenInfo1?.symbol : tokenInfo2?.symbol;
        // // const value = simulationError
        // //   ? "0"
        // //   : lookup(simulatedData?.amount, symbol)

        // const inputValue = !isReversed
        //   ? form.getValues(Key.value1)
        //   : form.getValues(Key.value2);
        // console.log("inputValue");
        // console.log(inputValue);
        // console.log("profitableQuery?.simulatedAmount");
        // console.log(profitableQuery?.simulatedAmount);
        // const value = !isReversed
        //   ? lookup(
        //       times(`${profitableQuery?.simulatedAmount}`, inputValue),
        //       symbol
        //     )
        //   : lookup(
        //       div(toAmount(inputValue), `${profitableQuery?.simulatedAmount}`)
        //     );

        // // Safe to use as deps
        // if (!isNil(value)) {
        //   setValue(key, value);
        //   setTimeout(() => {
        //     trigger(Key.value1);
        //     trigger(Key.value2);
        //   }, 100);
        // }
        break
      case Type.PROVIDE:
        if (poolResult && !poolLoading) {
          setValue(Key.value2, lookup(poolResult.estimated, tokenInfo2?.symbol))
          setTimeout(() => {
            trigger(Key.value1)
            trigger(Key.value2)
          }, 100)
          return
        }
        break
      case Type.WITHDRAW:
        if (
          poolResult !== undefined &&
          !poolLoading &&
          poolSymbol1 &&
          poolSymbol2
        ) {
          const amounts = poolResult.estimated.split("-")
          setValue(
            Key.value2,
            lookup(amounts[0], poolSymbol1) +
              poolSymbol1 +
              " - " +
              lookup(amounts[1], poolSymbol2) +
              poolSymbol2
          )
          setTimeout(() => {
            trigger(Key.value1)
            trigger(Key.value2)
          }, 100)
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isReversed,
    // simulationError,
    poolLoading,
    type,
    tokenInfo1,
    tokenInfo2,
    setValue,
    poolResult,
    poolSymbol1,
    poolSymbol2,
    trigger,
    // form,
    profitableQuery,
  ])
  useEffect(() => {
    setValue(Key.gasPrice, gasPrice || "")
    setValue(Key.feeValue, gasPrice ? ceil(times(fee.gas, gasPrice)) : "")
  }, [fee.gas, gasPrice, setValue])

  useEffect(() => {
    setValue(Key.feeValue, ceil(times(fee?.gas, gasPrice)) || "")
  }, [fee, gasPrice, setValue])

  const handleFailure = useCallback(() => {
    setTimeout(() => {
      form.reset(form.getValues(), {
        keepIsSubmitted: false,
        keepSubmitCount: false,
      })
    }, 125)
    setResult(undefined)
    window.location.reload()
  }, [form])

  const handleSubmit = useCallback(
    async (values) => {
      const {
        token1,
        token2,
        value1,
        value2,
        feeValue,
        feeSymbol,
        gasPrice,
      } = values
      try {
        settingsModal.close()

        let msgs: any = {}
        if (type === Type.SWAP) {
          const res = await generateContractMessages({
            type: Type.SWAP,
            sender: `${walletAddress}`,
            amount: `${value1}`,
            from: `${token1}`,
            to: `${token2}`,
            max_spread: slippageTolerance,
            belief_price: `${decimal(div(value1, value2), 18)}`,
          })

          console.log(res)
          console.log(profitableQuery?.index)
          console.log(res[profitableQuery?.index || 0])

          msgs = getMsgs(res[profitableQuery?.index || 0], {
            amount: `${value1}`,
            minimumReceived: profitableQuery
              ? calc.minimumReceived({
                  offer_amount: toAmount(formData[Key.value1]),
                  belief_price: decimal(
                    times(profitableQuery?.price, 1000000),
                    18
                  ),
                  max_spread: String(slippageTolerance),
                  commission: find(infoKey, formData[Key.symbol2]),
                })
              : "0",
            symbol: token1,
          })
          console.log(msgs)
          // const a = isNativeToken(token1)
          //   ? [
          //       ...insertIf(
          //         !isNativeToken(token2),
          //         newContractMsg(token2, {
          //           increase_allowance: { amount: amount2, spender: pair },
          //         })
          //       ),
          //       newContractMsg(pair, { swap: { offer_asset: asset } }, [
          //         { amount: amount1, denom: getSymbol(symbol1) },
          //       ]),
          //     ]
          //   : [
          //       ...insertIf(
          //         !isNativeToken(token2),
          //         newContractMsg(token2, {
          //           increase_allowance: { amount: amount2, spender: pair },
          //         })
          //       ),
          //       newContractMsg(token1, {
          //         send: {
          //           amount: amount1,
          //           contract: pair,
          //           msg: toBase64({ swap: {} }),
          //         },
          //       }),
          //     ];
        } else {
          msgs = (
            await generateContractMessages(
              {
                [Type.PROVIDE]: {
                  type: Type.PROVIDE,
                  sender: `${walletAddress}`,
                  fromAmount: `${value1}`,
                  toAmount: `${value2}`,
                  from: `${token1}`,
                  to: `${token2}`,
                  slippage: slippageTolerance,
                },
                [Type.WITHDRAW]: {
                  type: Type.WITHDRAW,
                  sender: `${walletAddress}`,
                  amount: `${value1}`,
                  lpAddr: `${lpContract}`,
                },
              }[type] as any
            )
          )[profitableQuery?.index || 0]
        }
        const symbol = getSymbol(feeSymbol)
        const gas = fee.gas
        const amount = feeValue
        const feeCoins = new Coins({})
        feeCoins.set(symbol, ceil(amount))
        tax.split(",").every((item) => {
          if (item === "0") {
            return false
          }
          const taxCoin = Coin.fromString(item)
          const feeCoin = feeCoins.get(taxCoin.denom)
          if (feeCoin === undefined) {
            feeCoins.set(taxCoin.denom, taxCoin.amount)
          } else {
            feeCoins.set(taxCoin.denom, feeCoin.amount.add(taxCoin.amount))
          }
          return true
        })

        const txOptions: CreateTxOptions = {
          msgs,
          memo: undefined,
          gasPrices: `${gasPrice}${getSymbol(feeSymbol)}`,
          fee: new StdFee(parseInt(gas), feeCoins),
        }

        const extensionResult = await terraExtensionPost(txOptions)

        // const extensionResult = await postTerraExtension(options, txFee);
        if (extensionResult) {
          setResult(extensionResult)
          return
        }
      } catch (error) {
        console.log(error)
        setResult(error)
      }
    },
    [
      settingsModal,
      type,
      getSymbol,
      fee.gas,
      tax,
      terraExtensionPost,
      generateContractMessages,
      walletAddress,
      slippageTolerance,
      profitableQuery,
      getMsgs,
      formData,
      find,
      lpContract,
    ]
  )

  const [result, setResult] = useState<TxResult | undefined>()

  useEffect(() => {
    const handleResize = () => {
      settingsModal.close()
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [settingsModal])

  return (
    <Wrapper>
      {formState.isSubmitted && result && (
        <Container sm>
          <Result
            response={result}
            error={result instanceof Error ? result : undefined}
            parserKey={type || "default"}
            onFailure={handleFailure}
          />
        </Container>
      )}
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleFailure)}
        style={{ display: formState.isSubmitted ? "none" : "block" }}
      >
        <TabView
          {...tabs}
          extra={[
            {
              iconUrl: iconSettings,
              onClick: () => {
                if (settingsModal.isOpen) {
                  settingsModal.close()
                  return
                }
                settingsModal.open()
              },
              disabled: formState.isSubmitting,
            },
            {
              iconUrl: iconReload,
              onClick: () => {
                window.location.reload()
              },
              disabled: formState.isSubmitting,
            },
          ]}
          side={[
            {
              component: (
                <Container sm>
                  <Settings
                    values={slippageSettings}
                    onChange={(settings) => {
                      setSlippageSettings(settings)
                    }}
                  />
                </Container>
              ),
              visible: settingsModal.isOpen,
              isModalOnMobile: true,
              onClose: () => {
                settingsModal.close()
              },
            },
          ]}
        >
          <Container sm>
            <SwapFormGroup
              input={{
                ...register(Key.value1, {
                  validate: {
                    asyncValidate: async (value) =>
                      await validateForm(Key.value1, { [Key.value1]: value }),
                  },
                }),
                step: step(formData[Key.symbol1]),
                placeholder: placeholder(formData[Key.symbol1]),
                autoComplete: "off",
                type: "number",
                onKeyDown: () => {
                  setIsReversed(false)
                },
              }}
              error={
                formState.dirtyFields[Key.value1]
                  ? formState?.errors?.[Key.value1]?.message
                  : undefined
              }
              feeSelect={(symbol) => {
                setValue(Key.feeSymbol, symbol)
                setFocus(Key.value1)
                setTimeout(() => {
                  trigger(Key.value1)
                }, 250)
              }}
              feeSymbol={formData[Key.feeSymbol]}
              help={renderBalance(balance1 || "0", formData[Key.symbol1])}
              label={
                {
                  [Type.SWAP]: "From",
                  [Type.PROVIDE]: "Asset",
                  [Type.WITHDRAW]: "LP",
                }[type]
              }
              unit={selectToken1.button}
              assets={selectToken1.assets}
              focused={selectToken1.isOpen}
              max={
                formData[Key.symbol1]
                  ? async () => {
                      if (type === Type.WITHDRAW) {
                        setValue(
                          Key.value1,
                          lookup(formData[Key.max1], formData[Key.symbol1])
                        )
                        trigger(Key.value1)
                        return
                      }
                      let taxVal = "0"
                      const taxs = (
                        await getTax({
                          symbol1: formData[Key.symbol1],
                          value1: lookup(
                            formData[Key.max1],
                            formData[Key.symbol1]
                          ),
                          max1: formData[Key.max1],
                        })
                      ).split(",")
                      for (let i = 0; i < taxs.length; i++) {
                        if (taxs[i] === "0") {
                          break
                        }
                        const coin = Coin.fromString(taxs[i])
                        if (coin.denom === getSymbol(formData[Key.symbol1])) {
                          taxVal = coin.toData().amount
                          break
                        }
                      }

                      let maxBalance = minus(formData[Key.max1], taxVal)
                      // fee
                      if (formData[Key.symbol1] === formData[Key.feeSymbol]) {
                        if (gte(maxBalance, formData[Key.feeValue])) {
                          maxBalance = minus(maxBalance, formData[Key.feeValue])
                        } else {
                          maxBalance = minus(maxBalance, maxBalance)
                        }
                      }

                      maxBalance = lookup(maxBalance, formData[Key.symbol1], {
                        dp: 6,
                      })
                      setValue(Key.value1, maxBalance)
                      trigger(Key.value1)
                    }
                  : undefined
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 22,
                marginTop: 22,
                alignContent: "center",
              }}
            >
              {type === Type.PROVIDE ? (
                <img src={SvgPlus} width={24} height={24} alt="Provide" />
              ) : (
                <img src={SvgArrow} width={24} height={24} alt="To" />
              )}
            </div>

            <SwapFormGroup
              input={{
                ...register(Key.value2, {
                  validate: {
                    asyncValidate: async (value) =>
                      await validateForm(Key.value2, { [Key.value2]: value }),
                  },
                }),
                ...(type !== Type.WITHDRAW
                  ? {
                      step: step(formData[Key.symbol2]),
                      placeholder: placeholder(formData[Key.symbol2]),
                      type: "number",
                    }
                  : {
                      placeholder: "-",
                      type: "text",
                    }),
                autoComplete: "off",
                readOnly: true,
                // [Type.PROVIDE, Type.WITHDRAW].includes(type) ||
                // (!isReversed && isAutoRouterLoading),
                onKeyDown: () => {
                  setIsReversed(true)
                },
              }}
              error={
                formState.dirtyFields[Key.value2]
                  ? formState?.errors?.[Key.value2]?.message
                  : undefined
              }
              help={
                type !== Type.WITHDRAW
                  ? renderBalance(balance2 || "0", formData[Key.symbol2])
                  : undefined
              }
              label={
                {
                  [Type.SWAP]: "To",
                  [Type.PROVIDE]: "Asset",
                  [Type.WITHDRAW]: "Received",
                }[type]
              }
              unit={type !== Type.WITHDRAW && selectToken2.button}
              assets={type !== Type.WITHDRAW && selectToken2.assets}
              focused={selectToken2.isOpen}
              isLoading={
                type === Type.SWAP &&
                !!formData[Key.value1] &&
                !!formData[Key.token1] &&
                !!formData[Key.token2] &&
                isAutoRouterLoading
              }
            />
            <SwapConfirm list={simulationContents} />
            <div>
              <div
                style={{
                  paddingTop: "20px",
                }}
              >
                <p>
                  The displaying number is the simulated result and can be
                  different from the actual swap rate. Trade at your own risk.
                </p>
              </div>
              <Button
                {...(walletAddress
                  ? {
                      children: type || "Submit",
                      loading: formState.isSubmitting,
                      disabled:
                        !formState.isValid ||
                        formState.isValidating ||
                        simulationContents?.length <= 0 ||
                        (type === Type.SWAP &&
                          (!profitableQuery || isAutoRouterLoading)),
                      type: "submit",
                    }
                  : {
                      onClick: () => connectModal.open(),
                      type: "button",
                      children: MESSAGE.Form.Button.ConnectWallet,
                    })}
                size="swap"
                submit
              />
            </div>
          </Container>
        </TabView>
      </form>
    </Wrapper>
  )
}

export default SwapForm
