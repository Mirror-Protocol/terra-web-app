import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import Container from "components/Container"
import { useForm } from "react-hook-form"
import Result from "./Result"
import TabView from "components/TabView"
import { useLocation } from "react-router-dom"
import { isNil } from "ramda"
import { LP, LUNA, MAX_SPREAD, ULUNA } from "constants/constants"
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
import useSwapSimulate from "rest/useSwapSimulate"
import useSwapSelectToken from "./useSwapSelectToken"
import SwapFormGroup from "./SwapFormGroup"
import usePairs, { tokenInfos, lpTokenInfos, InitLP } from "rest/usePairs"
import useBalance from "rest/useBalance"
import { minus, gte, times, ceil } from "libs/math"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"
import useGasPrice from "rest/useGasPrice"
import { hasTaxToken } from "helpers/token"
import { Coin, Coins, StdFee } from "@terra-money/terra.js"
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
  const { getSymbol } = useContractsAddress()
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
    slippage: `${MAX_SPREAD}`,
    custom: "",
  })
  const slippageTolerance = useMemo(() => {
    // 1% = 0.01
    return `${(
      parseFloat(
        (slippageSettings?.slippage === "custom"
          ? slippageSettings.custom
          : slippageSettings.slippage) || "1.0"
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
      symbol: formData[Key.symbol2],
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

  const simulation = useSwapSimulate({
    amount: toAmount(formData[!isReversed ? Key.value1 : Key.value2]),
    token: formData[!isReversed ? Key.token1 : Key.token2],
    pair,
    reverse: isReversed,
  })
  const {
    simulated: simulatedData,
    simulating: isSimulating,
    error: simulationError,
  } = simulation

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

    const minimumReceived = simulatedData
      ? calc.minimumReceived({
          offer_amount: toAmount(formData[Key.value1]),
          belief_price: decimal(simulatedData?.price, 18),
          max_spread: String(slippageTolerance),
          commission: find(infoKey, formData[Key.symbol2]),
        })
      : "10"

    return [
      ...insertIf(type === Type.SWAP, {
        title: <TooltipIcon content={Tooltip.Swap.Rate}>Rate</TooltipIcon>,
        content: `${decimal(simulatedData?.price, 6)} ${
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
      ...insertIf(type === Type.SWAP, {
        title: (
          <TooltipIcon content={Tooltip.Swap.TradingFee}>
            Trading Fee
          </TooltipIcon>
        ),
        content: (
          <Count symbol={formData[Key.symbol2]}>
            {simulatedData?.commission}
          </Count>
        ),
      }),
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
    ]
  }, [find, formData, poolResult, simulatedData, slippageTolerance, type])

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

  useEffect(() => {
    switch (type) {
      case Type.SWAP:
        const key = isReversed ? Key.value1 : Key.value2
        const symbol = isReversed ? tokenInfo1?.symbol : tokenInfo2?.symbol
        const value = simulationError
          ? "0"
          : lookup(simulatedData?.amount, symbol)

        // Safe to use as deps
        if (!isNil(value)) {
          setValue(key, value)
          setTimeout(() => {
            trigger(Key.value1)
            trigger(Key.value2)
          }, 100)
        }
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
  }, [
    simulatedData,
    isReversed,
    simulationError,
    poolLoading,
    type,
    tokenInfo1,
    tokenInfo2,
    setValue,
    poolResult,
    poolSymbol1,
    poolSymbol2,
    trigger,
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
        const msgs = await generateContractMessages(
          {
            [Type.SWAP]: {
              type: Type.SWAP,
              sender: `${walletAddress}`,
              amount: `${value1}`,
              from: `${token1}`,
              to: `${token2}`,
              max_spread: slippageTolerance,
              belief_price: `${value2}`,
            },
            [Type.PROVIDE]: {
              type: Type.PROVIDE,
              sender: `${walletAddress}`,
              amount: `${value1}`,
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

        const txOptions = {
          msgs: [msgs[0]],
          memo: undefined,
          purgeQueue: true,
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
      generateContractMessages,
      slippageTolerance,
      walletAddress,
      getSymbol,
      lpContract,
      type,
      fee,
      tax,
      terraExtensionPost,
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
            },
            {
              iconUrl: iconReload,
              onClick: () => {
                window.location.reload()
              },
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
                readOnly:
                  [Type.PROVIDE, Type.WITHDRAW].includes(type) ||
                  (!isReversed && isSimulating),
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
                          (simulationError ||
                            Number.isNaN(simulatedData?.amount || "") ||
                            parseFloat(simulatedData?.amount || "") <= 0)),
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
