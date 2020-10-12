import React from "react"
import { useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { isNil } from "ramda"

import useNewContractMsg from "../terra/useNewContractMsg"
import useTax from "../graphql/useTax"
import { MAX_SPREAD, UST, UUSD } from "../constants"
import MESSAGE from "../lang/MESSAGE.json"
import { div } from "../libs/math"
import { insertIf } from "../libs/utils"
import { useRefetch } from "../hooks"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { decimal } from "../libs/parse"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import { DlFooter } from "../components/Dl"

import { Type } from "../pages/Trade"
import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import { toBase64 } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import useSimulate from "./useSimulate"
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
    !value1 && value1Ref.current.focus()
  }

  /* simulation */
  const { token, pair } = getListedItem(symbol)
  const reverse = form.changed === Key.value2
  const params = !reverse
    ? { amount: amount1, symbol: symbol1 }
    : { amount: amount2, symbol: symbol2 }

  const simulation = useSimulate({ ...params, pair, reverse, type })
  const { simulated, ...result } = simulation
  const { loading: simulating, error } = result

  /* on simulate */
  useEffect(() => {
    const key = reverse ? Key.value1 : Key.value2
    const symbol = reverse ? symbol1 : symbol2
    const next = simulated ? lookup(simulated.amount, symbol) : error && ""
    // Safe to use as deps
    !isNil(next) && setValues((values) => ({ ...values, [key]: next }))
  }, [simulated, reverse, setValues, symbol1, symbol2, error])

  const simulatedContents = simulated && [
    {
      title: "Price",
      content: `1 ${symbol} ≈ ${format(simulated.price)} ${UST}`,
    },
    {
      title: "Spread",
      content: formatAsset(simulated.spread, symbol2),
    },
    {
      title: "Commission",
      content: formatAsset(simulated.commission, symbol2),
    },
  ]

  /* render:form */
  const config = {
    value: symbol,
    onSelect,
    priceKey,
    balanceKey,
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
  const price = {
    [Type.BUY]: `1 ${symbol} ≈ ${format(div(amount1, amount2))} ${UST}`,
    [Type.SELL]: `1 ${symbol} ≈ ${format(div(amount2, amount1))} ${UST}`,
  }[type]

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
  const swap = {
    belief_price: decimal(find(priceKey, symbol), 18),
    max_spread: String(MAX_SPREAD),
  }

  const data = {
    [Type.BUY]: [
      newContractMsg(
        pair,
        { swap: { ...swap, offer_asset: asset } },
        { amount: amount1, denom: UUSD }
      ),
    ],
    [Type.SELL]: [
      newContractMsg(token, {
        send: { amount: amount1, contract: pair, msg: toBase64({ swap }) },
      }),
    ],
  }[type]

  const disabled = invalid
  const messages = !simulating && error ? ["Simulation failed"] : undefined
  const container = { confirm, data, disabled, messages, tab, attrs }

  return (
    <FormContainer {...container} parserKey="trade">
      <FormGroup {...fields[Key.value1]} />
      <FormIcon name="arrow_downward" />
      <FormGroup {...fields[Key.value2]} />
      {simulatedContents && <DlFooter list={simulatedContents} margin />}
    </FormContainer>
  )
}

export default TradeForm
