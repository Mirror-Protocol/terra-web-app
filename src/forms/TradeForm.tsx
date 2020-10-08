import React from "react"
import { useRef, useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { isNil } from "ramda"

import useNewContractMsg from "../terra/useNewContractMsg"
import { useLazyContractQuery } from "../graphql/useContractQuery"
import useTax from "../graphql/useTax"
import { MAX_SPREAD, UST, UUSD } from "../constants"
import MESSAGE from "../lang/MESSAGE.json"
import { div, gt } from "../libs/math"
import { insertIf } from "../libs/utils"
import { useRefetch } from "../hooks"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import { DlFooter } from "../components/Dl"

import { Type } from "../pages/Trade"
import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import { toBase64 } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import useSelectAsset from "./useSelectAsset"
import FormGroup from "./FormGroup"
import FormIcon from "./FormIcon"

enum Key {
  symbol = "symbol",
  value1 = "value1",
  value2 = "value2",
}

const TradeForm = ({ type, tab }: { type: Type; tab: Tab }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ symbol: string }>()
  const { getListedItem, toToken } = useContractsAddress()
  const { find } = useContract()
  useRefetch([priceKey, balanceKey])

  /* form:validate */
  const validate = ({ value1, value2, symbol }: Values<Key>) => {
    const symbol1 = { [Type.BUY]: UUSD, [Type.SELL]: symbol }[type]
    const symbol2 = { [Type.BUY]: symbol, [Type.SELL]: UUSD }[type]
    const max = find(balanceKey, symbol1)

    return {
      [Key.value1]: v.amount(value1, { symbol: symbol1, max }),
      [Key.value2]: !symbol ? "" : v.amount(value2, { symbol: symbol2 }),
      [Key.symbol]: v.required(symbol),
    }
  }

  /* form:hook */
  const initial = {
    [Key.value1]: "",
    [Key.value2]: "",
    [Key.symbol]: state?.symbol ?? "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid } = form
  const { value1, value2, symbol } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)
  const symbol1 = { [Type.BUY]: UUSD, [Type.SELL]: symbol }[type]
  const symbol2 = { [Type.BUY]: symbol, [Type.SELL]: UUSD }[type]

  /* form:focus input on select asset */
  const value1Ref = useRef<HTMLInputElement>(null!)
  const value2Ref = useRef<HTMLInputElement>(null!)
  const onSelect = (symbol: string) => {
    setValue(Key.symbol, symbol)
    const ref = type === Type.BUY ? value2Ref : value1Ref
    !value1 && !value2 && ref.current.focus()
  }

  /* simulation */
  const reverse = form.changed === Key.value2
  const { token, pair } = getListedItem(symbol)
  const variables = useMemo(() => {
    const asset = toToken(
      !reverse
        ? { symbol: symbol1, amount: amount1 }
        : { symbol: symbol2, amount: amount2 }
    )

    return {
      contract: pair,
      msg: !reverse
        ? { simulation: { offer_asset: asset } }
        : { reverse_simulation: { ask_asset: asset } },
    }
  }, [pair, reverse, symbol1, symbol2, amount1, amount2, toToken])

  interface Simulated {
    return_amount?: string
    offer_amount?: string
    commission_amount: string
    spread_amount: string
  }

  const query = useLazyContractQuery<Simulated>(variables)
  const { result, parsed } = query
  const simulatedAmount = !reverse
    ? parsed?.return_amount
    : parsed?.offer_amount

  const price = {
    [Type.BUY]: `1 ${symbol} ≈ ${format(div(amount1, amount2))} ${UST}`,
    [Type.SELL]: `1 ${symbol} ≈ ${format(div(amount2, amount1))} ${UST}`,
  }[type]

  const simulatedContents = parsed && [
    {
      title: "Price",
      content: price,
    },
    {
      title: "Spread",
      content: formatAsset(parsed.spread_amount, symbol),
    },
    {
      title: "Commission",
      content: formatAsset(parsed.commission_amount, symbol),
    },
  ]

  const { load, loading: simulating, error } = result

  useEffect(() => {
    const { contract, msg } = variables
    const amount = (
      msg.simulation?.["offer_asset"] || msg.reverse_simulation?.["ask_asset"]
    )?.amount

    const valid = amount && gt(amount, 0) && contract
    valid && load()
  }, [variables, load])

  /* simulation:set value on simulate */
  useEffect(() => {
    const key = reverse ? Key.value1 : Key.value2
    const symbol = reverse ? symbol1 : symbol2
    const next = simulatedAmount ? lookup(simulatedAmount, symbol) : error && ""
    // Safe to use as deps
    !isNil(next) && setValues((values) => ({ ...values, [key]: next }))
  }, [simulatedAmount, reverse, setValues, symbol1, symbol2, error])

  /* render:form */
  const config = {
    value: symbol,
    onSelect,
    priceKey,
    balanceKey,
    omitUnheld: type === Type.SELL,
  }

  const select = useSelectAsset(config)

  const fields = getFields({
    [Key.value1]: {
      label: "From",
      input: {
        type: "number",
        step: step(symbol1),
        placeholder: placeholder(symbol1),
        disabled: reverse && simulating,
        autoFocus: true,
        ref: value1Ref,
      },
      unit: {
        [Type.BUY]: lookupSymbol(symbol1),
        [Type.SELL]: select.button,
      }[type],
      assets: type === Type.SELL && select.assets,
      help: renderBalance(find(balanceKey, symbol1), symbol1),
      focused: type === Type.SELL && select.isOpen,
    },

    [Key.value2]: {
      label: "To",
      input: {
        type: "number",
        step: step(symbol2),
        placeholder: placeholder(symbol2),
        disabled: !reverse && simulating,
        ref: value2Ref,
      },
      unit: {
        [Type.BUY]: select.button,
        [Type.SELL]: lookupSymbol(symbol2),
      }[type],
      assets: type === Type.BUY && select.assets,
      help: renderBalance(find(balanceKey, symbol2), symbol2),
      focused: type === Type.BUY && select.isOpen,
    },
  })

  /* confirm */
  const { tax } = useTax(amount1)
  const confirm = {
    contents: [
      {
        title: fields[Key.value1].label,
        content: formatAsset(amount1, symbol1),
      },
      {
        title: fields[Key.value2].label,
        content: formatAsset(amount2, symbol2),
      },
      {
        title: MESSAGE.Confirm.Label.EstimatedExchangeRate,
        content: price,
      },
      ...insertIf(type === Type.BUY, {
        title: "Tax",
        content: formatAsset(tax, UUSD),
      }),
    ],
    warning: MESSAGE.Confirm.Warning.Trade,
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const asset = toToken({ symbol: symbol1, amount: amount1 })
  const data = {
    [Type.BUY]: [
      newContractMsg(
        pair,
        { swap: { offer_asset: asset } },
        { amount: amount1, denom: UUSD }
      ),
    ],
    [Type.SELL]: [
      newContractMsg(token, {
        send: {
          amount: amount1,
          contract: pair,
          msg: toBase64({ swap: { max_spread: String(MAX_SPREAD) } }),
        },
      }),
    ],
  }[type]

  const disabled = invalid
  const messages = !simulating && error ? ["Simulation failed"] : undefined

  const container = {
    confirm,
    data,
    disabled,
    messages,
    tab,
    attrs,
    parserKey: "trade",
  }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value1]} />
      <FormIcon name="arrow_downward" />
      <FormGroup {...fields[Key.value2]} />
      {simulatedContents && <DlFooter list={simulatedContents} margin />}
    </FormContainer>
  )
}

export default TradeForm

// const { stringify: generateKey } = JSON
