import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import Container from "components/Container"
import { SubmitHandler, useForm } from "react-hook-form"
import Result from "./Result"
import TabView from "components/TabView"
import { useSearchParams } from "react-router-dom"
import {
  UST,
  DEFAULT_MAX_SPREAD,
  ULUNA,
  DEFAULT_TX_DEADLINE,
} from "constants/constants"
import { useNetwork, useContract, useAddress, useConnectModal } from "hooks"
import { lookup } from "libs/parse"
import { PriceKey, BalanceKey, AssetInfoKey } from "hooks/contractKeys"

import useSwapSelectToken from "./useSwapSelectToken"
import SwapFormGroup from "./SwapFormGroup"
import usePairs, { useLpTokenInfos, useTokenInfos } from "rest/usePairs"
import useBalance from "rest/useBalance"
import { times, ceil, div, lt, lte, floor } from "libs/math"
import useGasPrice from "rest/useGasPrice"
import { hasTaxToken } from "helpers/token"
import { Coins, CreateTxOptions, Fee } from "@terra-money/terra.js"
import { Type } from "pages/Swap"
import usePool from "rest/usePool"
import SvgArrow from "images/arrow.svg"
import Button from "components/Button"
import MESSAGE from "lang/MESSAGE.json"
import useAPI from "rest/useAPI"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import iconReload from "images/icon-reload.svg"
import { useLCDClient } from "layouts/WalletConnectProvider"
import { useContractsAddress } from "hooks/useContractsAddress"
import Disclaimer from "components/MigrationDisclaimer"
import styles from "./SwapFormGroup.module.scss"
import { calcTax } from "./formHelpers"
import { SettingValues } from "../components/Settings"
import useLocalStorage from "libs/useLocalStorage"

enum Key {
  value1 = "value1",
  value2 = "value2",
  feeSymbol = "feeSymbol",
  load = "load",
  symbol1 = "symbol1",
  symbol2 = "symbol2",
  maxFee = "maxFee",
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

const balanceKey = BalanceKey.LPSTAKABLE

function calculateProvideAssets(
  withdrawn: [string, string],
  pool: [string, string]
) {
  const target0 = times(div(pool[0], pool[1]), withdrawn[1])
  const target1 = times(div(pool[1], pool[0]), withdrawn[0])
  return [
    lt(target0, withdrawn[0]) ? target0 : withdrawn[0],
    lt(target1, withdrawn[1]) ? target1 : withdrawn[1],
  ]
}

const MigrateForm = ({ type }: { type?: Type }) => {
  const { pairs: v1Pairs, isLoading: isV1PairsLoading } = usePairs("v1")
  const { pairs: v2Pairs, isLoading: isV2PairsLoading } = usePairs("v2")

  const connectModal = useConnectModal()

  const [searchParams, setSearchParams] = useSearchParams()
  const from = searchParams.get("from") || ""

  const tokenInfos = useTokenInfos()
  const lpTokenInfos = useLpTokenInfos()

  const { getSymbol, isNativeToken } = useContractsAddress()
  const {
    loadTaxInfo,
    loadTaxRate,
    generateContractMessages: generateV1ContractMessages,
  } = useAPI("v1")
  const { generateContractMessages: generateV2ContractMessages } = useAPI("v2")
  const { fee } = useNetwork()
  const { find: findContract } = useContract()
  const walletAddress = useAddress()
  const wallet = useWallet()
  const { terra } = useLCDClient()
  const [residue, setResidue] = useState("0")
  const [txSettings, setTxSettings] = useLocalStorage<SettingValues>(
    "settings",
    {
      slippage: `${DEFAULT_MAX_SPREAD}`,
      custom: "",
      txDeadline: `${DEFAULT_TX_DEADLINE}`,
    }
  )
  const txDeadlineMinute = useMemo(() => {
    return Number(
      txSettings.txDeadline ? txSettings.txDeadline : DEFAULT_TX_DEADLINE
    )
  }, [txSettings])

  const form = useForm({
    defaultValues: {
      [Key.value1]: "",
      [Key.value2]: "",
      [Key.feeSymbol]: UST,
      [Key.load]: "",
      [Key.symbol1]: "",
      [Key.symbol2]: "",
      [Key.maxFee]: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  })
  const {
    register,
    watch,
    setValue,
    setFocus,
    formState,
    trigger,
    resetField,
  } = form
  const formData = watch()

  useEffect(() => {
    let isAborted = false
    if (!from) {
      setTimeout(() => {
        if (!isAborted) {
          const initLP = "terra17dkr9rnmtmu7x4azrpupukvur2crnptyfvsrvr"
          searchParams.set("from", initLP)
          setSearchParams(searchParams, { replace: true })
        }
      }, 100)
    }
    return () => {
      isAborted = true
    }
  }, [from, searchParams, setSearchParams, type, v1Pairs])

  const handleToken1Select = (token: string) => {
    searchParams.set("from", token)
    setSearchParams(searchParams, { replace: true })
  }
  const tokenInfo1 = useMemo(() => {
    return tokenInfos.get(from)
  }, [from, tokenInfos])

  const { balance: balance1 } = useBalance(from)
  const [balanceWithTax, setBalanceWithTax] = useState<string>()

  const [feeAddress, setFeeAddress] = useState("")
  const fetchFeeAddress = useCallback(() => {
    return setFeeAddress(
      tokenInfos.get(formData[Key.feeSymbol])?.contract_addr || ""
    )
  }, [formData, tokenInfos])

  useEffect(() => {
    if (!feeAddress) {
      fetchFeeAddress()
    }
  }, [feeAddress, fetchFeeAddress])

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchFeeAddress()
    }, 3000)

    fetchFeeAddress()
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [formData, fetchFeeAddress])

  const { balance: maxFeeBalance } = useBalance(feeAddress)

  const selectToken = useSwapSelectToken(
    {
      value: from,
      symbol: formData[Key.symbol1],
      onSelect: handleToken1Select,
      priceKey,
      balanceKey,
      isFrom: true,
      oppositeValue: "",
      onSelectOpposite: () => {},
    },
    v1Pairs,
    Type.WITHDRAW
  )

  const {
    pairAddress: selectedPairAddress,
    lpContract,
    poolSymbol1,
    poolSymbol2,
    poolContract1,
    poolContract2,
    poolDecimal1,
    poolDecimal2,
  } = useMemo(() => {
    if (isV1PairsLoading) {
      return {}
    }
    const info1 = lpTokenInfos.get(from)?.[0]
    const info2 = lpTokenInfos.get(from)?.[1]
    const selected = v1Pairs.find((item) => {
      return (
        item.pair.find((s) => s.contract_addr === info1?.contract_addr) &&
        item.pair.find((s) => s.contract_addr === info2?.contract_addr)
      )
    })

    const contract = selected?.contract || ""
    const lpContract = selected?.liquidity_token || ""
    const lpTokenInfo = lpTokenInfos.get(lpContract)

    return {
      pairAddress: contract,
      lpContract,
      poolSymbol1: lpTokenInfo?.[0]?.symbol,
      poolSymbol2: lpTokenInfo?.[1]?.symbol,
      poolContract1: lpTokenInfo?.[0]?.contract_addr,
      poolContract2: lpTokenInfo?.[1]?.contract_addr,
      poolDecimal1: lpTokenInfo?.[0]?.decimals,
      poolDecimal2: lpTokenInfo?.[1]?.decimals,
    }
  }, [isV1PairsLoading, lpTokenInfos, from, v1Pairs])

  const selectedV2Pairs = useMemo(() => {
    const [info1, info2] = lpTokenInfos.get(from) || []

    const selected = v2Pairs.find((item) => {
      return (
        item.pair.find((s) => s.contract_addr === info1?.contract_addr) &&
        item.pair.find((s) => s.contract_addr === info2?.contract_addr)
      )
    })

    return selected
  }, [from, lpTokenInfos, v2Pairs])

  const { result: withdrawSimulation, poolLoading } = usePool(
    selectedPairAddress,
    formData[Key.symbol1],
    lookup(balance1, from),
    Type.WITHDRAW,
    balance1
  )

  useEffect(() => {
    loadTaxRate().then((rate) => {
      setBalanceWithTax(floor(times(balance1, 1 - parseFloat(rate))))
    })
  }, [balance1, loadTaxRate])

  const { result: withdrawSimulationWithTax, poolLoading: poolLoadingWithTax } =
    usePool(
      selectedPairAddress,
      formData[Key.symbol1],
      lookup(balanceWithTax, from),
      Type.WITHDRAW,
      balanceWithTax
    )

  const provideSimulation = usePool(
    selectedV2Pairs?.contract,
    selectedV2Pairs?.pair[1].symbol,
    "1000000",
    Type.PROVIDE
  )

  const { gasPrice } = useGasPrice(formData[Key.feeSymbol])
  const getTax = useCallback(
    async (data: { token: string; amount: string }[]) => {
      const newTax = new Coins()

      const taxRate = await loadTaxRate()
      await Promise.all(
        data.map(async ({ token, amount }) => {
          if (token && hasTaxToken(token) && taxRate && amount) {
            const taxCap = await loadTaxInfo(token)
            const calculatedTax = calcTax(amount, taxCap, taxRate)
            newTax.set(token, calculatedTax)
          }
        })
      )
      return newTax
    },
    [loadTaxInfo, loadTaxRate]
  )

  useEffect(() => {
    setValue(Key.symbol1, tokenInfo1?.symbol || "")
  }, [setValue, tokenInfo1])

  useEffect(() => {
    setValue(Key.maxFee, maxFeeBalance || "")
  }, [maxFeeBalance, setValue])

  useEffect(() => {
    if (
      withdrawSimulation !== undefined &&
      withdrawSimulationWithTax !== undefined &&
      !poolLoading &&
      !poolLoadingWithTax &&
      poolSymbol1 &&
      poolSymbol2
    ) {
      const amounts =
        poolContract1 === ULUNA || poolContract2 === ULUNA
          ? withdrawSimulationWithTax.estimated.split("-")
          : withdrawSimulation.estimated.split("-")
      const srcAsset1 = lookup(amounts[0], poolContract1)
      const srcAsset2 = lookup(amounts[1], poolContract2)

      setValue(
        Key.value1,
        srcAsset1 + poolSymbol1 + " - " + srcAsset2 + poolSymbol2
      )

      const calculated = calculateProvideAssets(
        [amounts[0], amounts[1]],
        [
          provideSimulation?.result?.poolAmount1 || "1",
          provideSimulation?.result?.poolAmount2 || "1",
        ]
      )

      const destAsset1 = lookup(calculated[0], poolContract1)
      const destAsset2 = lookup(calculated[1], poolContract2)

      setValue(
        Key.value2,
        destAsset1 + poolSymbol1 + " - " + destAsset2 + poolSymbol2
      )

      if (Number(srcAsset1) - Number(destAsset1) > 0) {
        setResidue(
          parseFloat(String(Number(srcAsset1) - Number(destAsset1))).toFixed(
            poolDecimal1
          ) +
            " " +
            poolSymbol1
        )
      } else if (Number(srcAsset2) - Number(destAsset2) > 0) {
        setResidue(
          parseFloat(String(Number(srcAsset2) - Number(destAsset2))).toFixed(
            poolDecimal2
          ) +
            " " +
            poolSymbol2
        )
      } else {
        setResidue("0")
      }
    }
  }, [
    poolContract1,
    poolContract2,
    poolLoading,
    withdrawSimulation,
    withdrawSimulationWithTax,
    poolSymbol1,
    poolSymbol2,
    setValue,
    provideSimulation,
    poolDecimal1,
    poolDecimal2,
  ])

  const feeValue = useMemo(
    () => (gasPrice ? ceil(times(fee?.gas, gasPrice)) : ""),
    [fee, gasPrice]
  )

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

  const handleSubmit = useCallback<SubmitHandler<Partial<Record<Key, string>>>>(
    async (values) => {
      const { feeSymbol } = values
      try {
        const withdrawMsgs = (
          await generateV1ContractMessages({
            type: Type.WITHDRAW,
            sender: `${walletAddress}`,
            amount: `${
              poolContract1 === ULUNA || poolContract2 === ULUNA
                ? lookup(balanceWithTax, from)
                : lookup(balance1, from)
            }`,
            lpAddr: `${lpContract}`,
          })
        ).map((msg: any) => {
          return Array.isArray(msg) ? msg[0] : msg
        })

        if (
          !selectedV2Pairs ||
          !withdrawSimulation ||
          !withdrawSimulationWithTax ||
          !poolContract1 ||
          !poolContract2
        ) {
          return
        }

        const [fromAmount, toAmount] =
          poolContract1 === ULUNA || poolContract2 === ULUNA
            ? withdrawSimulationWithTax.estimated.split("-")
            : withdrawSimulation.estimated.split("-")

        const calculatedAmounts = calculateProvideAssets(
          [fromAmount, toAmount],
          [
            provideSimulation?.result?.poolAmount1 || "1",
            provideSimulation?.result?.poolAmount2 || "1",
          ]
        )

        const provideMsgs = (
          await generateV2ContractMessages({
            type: Type.PROVIDE,
            from: poolContract1,
            fromAmount: lookup(calculatedAmounts[0], poolSymbol1),
            to: poolContract2,
            toAmount: lookup(calculatedAmounts[1], poolSymbol2),
            sender: `${walletAddress}`,
            slippage: lte(provideSimulation.result?.totalShare || "", 0)
              ? undefined
              : DEFAULT_MAX_SPREAD / 100,
            deadline: Number(txDeadlineMinute),
          })
        ).map((msg: any) => {
          return Array.isArray(msg) ? msg[0] : msg
        })

        const txOptions: CreateTxOptions = {
          msgs: [...withdrawMsgs, ...provideMsgs],
          memo: undefined,
          gasPrices: `${gasPrice}${getSymbol(feeSymbol || "")}`,
        }

        const signMsg = await terra.tx.create(
          [{ address: walletAddress }],
          txOptions
        )

        const taxes = await getTax([
          { token: poolContract1, amount: calculatedAmounts[0] },
          { token: poolContract2, amount: calculatedAmounts[1] },
        ])

        const feeCoins = signMsg.auth_info.fee.amount.add(taxes)

        const extensionResult = await wallet.post(
          {
            ...txOptions,
            fee: new Fee(signMsg.auth_info.fee.gas_limit, feeCoins),
          },
          walletAddress
        )

        if (extensionResult) {
          setResult(extensionResult)
          return
        }
      } catch (error) {
        console.error(error)
        setResult(error as any)
      }
    },
    [
      generateV1ContractMessages,
      walletAddress,
      balance1,
      balanceWithTax,
      from,
      lpContract,
      selectedV2Pairs,
      withdrawSimulation,
      withdrawSimulationWithTax,
      poolContract1,
      poolContract2,
      provideSimulation,
      generateV2ContractMessages,
      poolSymbol1,
      poolSymbol2,
      gasPrice,
      getSymbol,
      terra.tx,
      getTax,
      wallet,
    ]
  )

  const [result, setResult] = useState<TxResult | undefined>()

  return (
    <Wrapper>
      <Disclaimer />
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
          selectedTabName="migration"
          tabs={[{ name: "migration", title: "Migration" }]}
          extra={[
            {
              iconUrl: iconReload,
              onClick: () => {
                searchParams.set("from", "")
                setSearchParams(searchParams, { replace: true })
                resetField(Key.value1)
                resetField(Key.value2)
                resetField(Key.feeSymbol)
                setFeeAddress("")
              },
              disabled: formState.isSubmitting,
            },
          ]}
        >
          <Container sm>
            <SwapFormGroup
              input={{
                ...register(Key.value1),
                placeholder: "-",
                autoComplete: "off",
                type: "text",
                readOnly: true,
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
              label="From"
              unit={selectToken.button}
              assets={selectToken.assets}
              focused={selectToken.isOpen}
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
              <img src={SvgArrow} width={24} height={24} alt="To" />
            </div>
            <SwapFormGroup
              input={{
                ...register(Key.value2),
                placeholder: "-",
                type: "text",
                autoComplete: "off",
                readOnly: true,
              }}
              // help={{ title: "*Residue", content: "?" }}
              label={
                <>
                  <label>To</label>
                  <label className={styles.sublabel}> (Estimated value)</label>
                </>
              }
              help={{ title: "*Residue", content: residue }}
            />
            <div>
              <div
                style={{
                  paddingTop: "20px",
                }}
              >
                <p>
                  Residue assets out of the pair will be sent to your wallet.
                  <br />
                  The resulting price may be different from the expected price.
                  Trade at your own risk.
                </p>
              </div>
              <Button
                {...(walletAddress
                  ? {
                      children: "Migrate",
                      loading: formState.isSubmitting,
                      disabled:
                        !formState.isValid ||
                        formState.isValidating ||
                        !balance1 ||
                        !Number(balance1) ||
                        !balanceWithTax ||
                        !Number(balanceWithTax),
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

export default MigrateForm
