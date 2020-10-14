import React from "react"
import { useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { isNil } from "ramda"

import useNewContractMsg from "../terra/useNewContractMsg"
import { MAX_SPREAD, UUSD } from "../constants"
import { useRefetch } from "../hooks"
import { format, lookup, lookupSymbol } from "../libs/parse"
import { decimal } from "../libs/parse"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"

import Count from "../components/Count"
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
  const uusd = { [Type.BUY]: amount1, [Type.SELL]: amount2 }[type]
  const price = find(priceKey, symbol)

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
  const simulationParams = !reverse
    ? { amount: amount1, symbol: symbol1 }
    : { amount: amount2, symbol: symbol2 }

  const simulation = useSimulate({ ...simulationParams, pair, reverse, type })
  const { simulated, loading: simulating, error } = simulation

  /* on simulate */
  useEffect(() => {
    const key = reverse ? Key.value1 : Key.value2
    const symbol = reverse ? symbol1 : symbol2
    const next = simulated ? lookup(simulated.amount, symbol) : error && ""
    // Safe to use as deps
    !isNil(next) && setValues((values) => ({ ...values, [key]: next }))
  }, [simulated, reverse, setValues, symbol1, symbol2, error])

  /* render:form */
  const config = { value: symbol, onSelect, priceKey, balanceKey }
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
  const contents = [
    {
      title: "Price",
      content: (
        <Count format={format} symbol={UUSD}>
          {simulated?.price}
        </Count>
      ),
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const asset = toToken({ symbol: symbol1, amount: amount1 })
  const swap = {
    belief_price: decimal(price, 18),
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

  const messages = !simulating
    ? error
      ? ["Simulation failed"]
      : undefined
    : undefined

  const disabled = invalid || simulating || !!messages?.length
  const container = { contents, data, disabled, messages, tab, attrs }

  return (
    <FormContainer {...container} pretax={uusd} parserKey="trade">
      <FormGroup {...fields[Key.value1]} />
      <FormIcon name="arrow_downward" />
      <FormGroup {...fields[Key.value2]} />
    </FormContainer>
  )
}

export default TradeForm
