import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import Container from "components/Container"
import { useForm } from "react-hook-form"
import Result from "./Result"
import TabView from "components/TabView"
import { useLocation } from "react-router-dom"
import { UST, DEFAULT_MAX_SPREAD, ULUNA } from "constants/constants"
import { useNetwork, useContract, useAddress, useConnectModal } from "hooks"
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
import useSwapSelectToken from "./useSwapSelectToken"
import SwapFormGroup from "./SwapFormGroup"
import usePairs, { tokenInfos, lpTokenInfos, InitLP } from "rest/usePairs"
import useBalance from "rest/useBalance"
import { minus, gte, times, ceil, div } from "libs/math"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"
import useGasPrice from "rest/useGasPrice"
import { hasTaxToken } from "helpers/token"
import { Coins, CreateTxOptions } from "@terra-money/terra.js"
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
import { useLCDClient } from "layouts/WalletConnectProvider"
import useQueryString from "hooks/useQueryString"
import { useContractsAddress } from "hooks/useContractsAddress"

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
`

const Warning = {
  color: "red",
  FontWeight: "bold",
}

const SwapForm = ({ type, tabs }: { type: Type; tabs: TabViewProps }) => {
  const connectModal = useConnectModal()
  const { state } = useLocation<{ symbol: string }>()
  const [from, setFrom] = useQueryString<string>(
    "from",
    type !== Type.WITHDRAW ? state?.symbol ?? ULUNA : InitLP
  )
  const [to, setTo] = useQueryString<string>("to", state?.symbol ?? "")
  const { getSymbol, isNativeToken } = useContractsAddress()
  const { loadTaxInfo, loadTaxRate, generateContractMessages } = useAPI()
  const { fee } = useNetwork()
  const { find } = useContract()
  const walletAddress = useAddress()
  const { post: terraExtensionPost } = useWallet()
  const { terra } = useLCDClient()
  const settingsModal = useModal()
  const [slippageSettings, setSlippageSettings] =
    useLocalStorage<SettingValues>("slippage", {
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
      [Key.token1]: from || "",
      [Key.token2]: to || "",
      [Key.feeValue]: "",
      [Key.feeSymbol]: UST,
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

  useEffect(() => {
    console.log("setFrom", formData[Key.token1])
    setFrom(formData[Key.token1])
    console.log("setTo", formData[Key.token2])
    setTo(formData[Key.token2])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

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
  const handleSwitchToken = () => {
    if (!pairSwitchable) {
      return
    }
    const token1 = formData[Key.token1]
    const token2 = formData[Key.token2]
    const key = isReversed ? Key.value1 : Key.value2
    const value = isReversed ? formData[Key.value2] : formData[Key.value1]
    handleToken1Select(token2)
    handleToken2Select(token1)
    setIsReversed(!isReversed)
    setValue(key, value)
  }

  const tokenInfo1 = useMemo(() => {
    return tokenInfos.get(formData[Key.token1])
  }, [formData])

  const tokenInfo2 = useMemo(() => {
    return tokenInfos.get(formData[Key.token2])
  }, [formData])

  const pairSwitchable = useMemo(
    () => formData[Key.token1] !== "" && formData[Key.token2] !== "",
    [formData]
  )

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

  const {
    pair,
    lpContract,
    poolSymbol1,
    poolSymbol2,
    poolContract1,
    poolContract2,
  } = useMemo(() => {
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
      poolContract1: lpTokenInfo?.[0]?.contract_addr,
      poolContract2: lpTokenInfo?.[1]?.contract_addr,
    }
  }, [formData, pairs, tokenInfo1, tokenInfo2, type])

  const { isLoading: isAutoRouterLoading, profitableQuery } = useAutoRouter({
    from: formData[Key.token1],
    to: formData[Key.token2],
    amount: formData[Key.value1],
    type: formState.isSubmitted ? undefined : type,
  })

  const { result: poolResult, poolLoading } = usePool(
    pair,
    formData[Key.symbol1],
    formData[Key.value1],
    type,
    balance1
  )

  const [tax, setTax] = useState<Coins>(new Coins())

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
          expectedAmount: `${profitableQuery?.simulatedAmount}`,
          max_spread: String(slippageTolerance),
          commission: find(infoKey, formData[Key.symbol2]),
          decimals: tokenInfo1?.decimals,
        })
      : "0"

    const spread =
      tokenInfo2 && poolResult?.estimated
        ? div(
            minus(
              poolResult?.estimated,
              toAmount(formData[Key.value2], formData[Key.token2])
            ),
            poolResult?.estimated
          )
        : ""

    const taxs = tax.filter((coin) => !coin.amount.equals(0))

    return [
      ...insertIf(type === Type.SWAP, {
        title: <TooltipIcon content={Tooltip.Swap.Rate}>Rate</TooltipIcon>,
        content: `${decimal(profitableQuery?.price, tokenInfo1?.decimals)} ${
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
        content: `${lookup(poolResult?.LP, lpContract)} LP`,
      }),
      ...insertIf(type === Type.WITHDRAW, {
        title: "LP after Tx",
        content: `${lookup(poolResult?.LP, lpContract)} LP`,
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
      ...insertIf(taxs.toArray().length > 0, {
        title: `Tax`,
        content: taxs.toArray().map((coin, index) => {
          return index === 0 ? (
            <Count symbol={coin.denom}>{lookup(coin.amount.toString())}</Count>
          ) : (
            <div>
              <span>, </span>
              <Count symbol={coin.denom}>
                {lookup(coin.amount.toString())}
              </Count>
            </div>
          )
        }),
      }),
      ...insertIf(type === Type.SWAP && spread !== "", {
        title: <TooltipIcon content={Tooltip.Swap.Spread}>Spread</TooltipIcon>,
        content: (
          <div style={gte(spread, "0.01") ? Warning : undefined}>
            <Count format={(value) => `${percent(value)}`}>{spread}</Count>
          </div>
        ),
      }),
      ...insertIf(type === Type.SWAP && profitableQuery?.tokenRoutes?.length, {
        title: (
          <TooltipIcon content="Optimized route for your optimal gain">
            Route
          </TooltipIcon>
        ),
        content: (
          <span
            title={profitableQuery?.tokenRoutes
              ?.map((token) => tokenInfos.get(token)?.symbol)
              .join(" → ")}
          >
            {profitableQuery?.tokenRoutes
              ?.map((token) => tokenInfos.get(token)?.symbol)
              .join(" → ")}
          </span>
        ),
      }),
    ]
  }, [
    find,
    formData,
    poolResult,
    profitableQuery,
    slippageTolerance,
    type,
    lpContract,
    tokenInfo1,
    tokenInfo2,
    tax,
  ])

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
      const msg = Array.isArray(_msg) ? _msg[0] : _msg
      if (msg?.execute_msg?.send?.msg?.execute_swap_operations) {
        msg.execute_msg.send.msg.execute_swap_operations.minimum_receive =
          parseInt(`${minimumReceived}`, 10).toString()
        if (isNativeToken(symbol || "")) {
          msg.coins = Coins.fromString(toAmount(`${amount}`) + symbol)
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
          symbol
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
    async ({ value1, value2, token1, token2 }) => {
      let newTax = tax

      newTax.map((coin) => {
        if (
          !(
            coin.denom === token1 ||
            (type === Type.PROVIDE && coin.denom === token2)
          )
        ) {
          newTax.set(coin.denom, 0)
        }

        return true
      })

      const taxCap1 = await loadTaxInfo(token1)
      const taxCap2 = await loadTaxInfo(token2)
      const taxRate = await loadTaxRate()
      if (
        token1 &&
        hasTaxToken(token1) &&
        (taxCap1 || taxCap1 === "") &&
        taxRate
      ) {
        const tax1 = calcTax(toAmount(value1), taxCap1, taxRate)
        newTax.set(token1, tax1)
      }
      if (
        type === Type.PROVIDE &&
        token2 &&
        hasTaxToken(token2) &&
        (taxCap2 || taxCap2 === "") &&
        taxRate
      ) {
        const tax2 = calcTax(toAmount(value2), taxCap2, taxRate)
        newTax.set(token2, tax2)
      }
      return newTax
    },
    [type, loadTaxInfo, loadTaxRate, tax]
  )

  const isTaxCalculating = useRef<boolean>(false)
  useEffect(() => {
    if (isTaxCalculating?.current) {
      return
    }
    isTaxCalculating.current = true
    getTax({
      value1: formData[Key.value1],
      value2: formData[Key.value2],
      max1: formData[Key.max1],
      max2: formData[Key.max2],
      token1: formData[Key.token1],
      token2: formData[Key.token2],
    })
      .then((value) => {
        setTax(value)
      })
      .catch(() => {
        setTax(tax)
      })
      .finally(() => {
        isTaxCalculating.current = false
      })
  }, [formData, tax, getTax])

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
      token1,
      token2,
    } = { ...formData, ...(newValues || {}) }

    if (key === Key.value1) {
      const taxCap = await loadTaxInfo(token1)
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
          decimals: tokenInfo1?.decimals,
          token: token1,
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
            decimals: tokenInfo2?.decimals,
            token: token2,
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
    if (type === Type.SWAP || type === Type.PROVIDE) {
      if (!from || !tokenInfos.get(from)) {
        setValue(Key.token1, ULUNA)
        setValue(Key.value1, "")
      }
      if (!to || !tokenInfos.get(to)) {
        setValue(Key.token2, "")
        setValue(Key.value2, "")
      }
    }

    if (type === Type.WITHDRAW) {
      if (!from || !lpTokenInfos.get(from)) {
        setValue(Key.token1, InitLP)
        setValue(Key.value1, "")
      }
      setValue(Key.token2, "")
      setValue(Key.value2, "")
    }
  }, [type, setValue, state, from, to])

  useEffect(() => {
    setValue(Key.symbol1, tokenInfo1?.symbol || "")
  }, [setValue, tokenInfo1])

  useEffect(() => {
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
      if (!eventType && [Key.value1, Key.value2].includes(watchName as Key)) {
        return
      }
      if (type === Type.SWAP) {
        if (
          [Key.value1, Key.token1, Key.token2, Key.feeSymbol].includes(
            watchName as Key
          )
        ) {
          setValue(
            Key.value2,
            lookup(`${profitableQuery?.simulatedAmount}`, data.token2)
          )
          trigger(Key.value2)
        }
        if (watchName === Key.value2) {
          setValue(
            Key.value1,
            lookup(
              div(
                toAmount(`${data[Key.value2]}`, data[Key.token2]),
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
        break
      case Type.PROVIDE:
        if (poolResult && !poolLoading) {
          setValue(
            Key.value2,
            lookup(poolResult.estimated, tokenInfo2?.contract_addr)
          )
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
            lookup(amounts[0], poolContract1) +
              poolSymbol1 +
              " - " +
              lookup(amounts[1], poolContract2) +
              poolSymbol2
          )
          setTimeout(() => {
            trigger(Key.value1)
            trigger(Key.value2)
          }, 100)
        }
    }
  }, [
    isReversed,
    poolLoading,
    type,
    tokenInfo1,
    tokenInfo2,
    setValue,
    poolResult,
    poolSymbol1,
    poolSymbol2,
    poolContract1,
    poolContract2,
    trigger,
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
      const { token1, token2, value1, value2, feeSymbol, gasPrice } = values
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
            belief_price: `${decimal(
              times(
                div(value1, value2),
                Math.pow(
                  10,
                  (tokenInfo1?.decimals || 0) - (tokenInfo2?.decimals || 0)
                ) || 1
              ),
              18
            )}`,
          })

          msgs = getMsgs(res[profitableQuery?.index || 0], {
            amount: `${value1}`,
            minimumReceived: profitableQuery
              ? calc.minimumReceived({
                  expectedAmount: `${profitableQuery?.simulatedAmount}`,
                  max_spread: String(slippageTolerance),
                  commission: find(infoKey, formData[Key.symbol2]),
                  decimals: tokenInfo1?.decimals,
                })
              : "0",
            symbol: token1,
          })
        } else {
          msgs = await generateContractMessages(
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
          msgs = msgs.map((msg: any) => {
            return Array.isArray(msg) ? msg[0] : msg
          })
        }

        let txOptions: CreateTxOptions = {
          msgs,
          memo: undefined,
          gasPrices: `${gasPrice}${getSymbol(feeSymbol)}`,
        }

        const signMsg = await terra.tx.create(
          [{ address: walletAddress }],
          txOptions
        )
        txOptions.fee = signMsg.auth_info.fee

        const extensionResult = await terraExtensionPost(txOptions)

        if (extensionResult) {
          setResult(extensionResult)
          return
        }
      } catch (error) {
        setResult(error as any)
      }
    },
    [
      settingsModal,
      type,
      getSymbol,
      terraExtensionPost,
      generateContractMessages,
      walletAddress,
      slippageTolerance,
      profitableQuery,
      getMsgs,
      formData,
      find,
      lpContract,
      tokenInfo1,
      tokenInfo2,
      terra.tx,
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
                step: step(tokenInfo1?.decimals),
                placeholder: placeholder(tokenInfo1?.decimals),
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
                          lookup(formData[Key.max1], formData[Key.token1])
                        )
                        trigger(Key.value1)
                        return
                      }
                      let taxVal = "0"
                      const taxs = await getTax({
                        token1: formData[Key.token1],
                        value1: lookup(
                          formData[Key.max1],
                          formData[Key.token1]
                        ),
                        max1: formData[Key.max1],
                      })

                      taxs.map((tax) => {
                        if (tax.denom === formData[Key.token1]) {
                          taxVal = tax.toData().amount
                          return false
                        }
                        return true
                      })
                      let maxBalance = minus(formData[Key.max1], taxVal)
                      // fee
                      if (formData[Key.symbol1] === formData[Key.feeSymbol]) {
                        if (gte(maxBalance, formData[Key.feeValue])) {
                          maxBalance = minus(maxBalance, formData[Key.feeValue])
                        } else {
                          maxBalance = minus(maxBalance, maxBalance)
                        }
                      }

                      maxBalance = lookup(maxBalance, formData[Key.token1])
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
                <img
                  src={SvgArrow}
                  width={24}
                  height={24}
                  alt="To"
                  onClick={handleSwitchToken}
                  style={{
                    cursor: pairSwitchable ? "pointer" : "auto",
                  }}
                />
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
                      step: step(tokenInfo2?.decimals),
                      placeholder: placeholder(tokenInfo2?.decimals),
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
