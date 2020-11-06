import React from "react"
import { useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { isNil } from "ramda"

import useNewContractMsg from "../terra/useNewContractMsg"
import { MAX_SPREAD, UUSD } from "../constants"
import Tooltip from "../lang/Tooltip.json"
import { div } from "../libs/math"
import { useRefetch } from "../hooks"
import { format, lookup, lookupSymbol } from "../libs/parse"
import { decimal } from "../libs/parse"
import { toAmount } from "../libs/parse"
import calc from "../helpers/calc"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey, AssetInfoKey } from "../hooks/contractKeys"

import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
import { Type } from "../pages/Trade"
import useTradeReceipt from "./receipts/useTradeReceipt"
import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import { toBase64 } from "./formHelpers"
import useForm from "./useForm"
import useSimulate from "./useSimulate"
import useSelectAsset from "./useSelectAsset"
import FormContainer from "./FormContainer"
import FormGroup from "./FormGroup"
import FormIcon from "./FormIcon"

enum Key {
  token = "token",
  value1 = "value1",
  value2 = "value2",
}

const TradeForm = ({ type, tab }: { type: Type; tab: Tab }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN
  const infoKey = AssetInfoKey.COMMISSION

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { whitelist, getSymbol, toToken } = useContractsAddress()
  const { find } = useContract()
  useRefetch([priceKey, balanceKey, infoKey])

  /* form:validate */
  const validate = ({ value1, value2, token }: Values<Key>) => {
    const token1 = { [Type.BUY]: UUSD, [Type.SELL]: token }[type]
    const token2 = { [Type.BUY]: token, [Type.SELL]: UUSD }[type]
    const symbol1 = getSymbol(token1)
    const symbol2 = getSymbol(token2)
    const max = find(balanceKey, token1)

    return {
      [Key.value1]: v.amount(value1, { symbol: symbol1, max }),
      [Key.value2]: !token ? "" : v.amount(value2, { symbol: symbol2 }),
      [Key.token]: v.required(token),
    }
  }

  /* form:hook */
  const initial = {
    [Key.value1]: "",
    [Key.value2]: "",
    [Key.token]: state?.token ?? "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid } = form
  const { value1, value2, token } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)
  const token1 = { [Type.BUY]: UUSD, [Type.SELL]: token }[type]
  const token2 = { [Type.BUY]: token, [Type.SELL]: UUSD }[type]
  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)
  const uusd = { [Type.BUY]: amount1, [Type.SELL]: amount2 }[type]

  /* form:focus input on select asset */
  const value1Ref = useRef<HTMLInputElement>(null!)
  const value2Ref = useRef<HTMLInputElement>(null!)
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value1 && value1Ref.current.focus()
  }

  /* simulation */
  const { pair } = whitelist[token] ?? {}
  const reverse = form.changed === Key.value2
  const simulationParams = !reverse
    ? { amount: amount1, token: token1 }
    : { amount: amount2, token: token2 }

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
  const config = { token, onSelect, priceKey, balanceKey }
  const select = useSelectAsset(config)
  const delisted = whitelist[token1]?.["status"] === "DELISTED"

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
        [Type.SELL]: delisted ? symbol1 : select.button,
      }[type],
      assets: type === Type.SELL && select.assets,
      help: renderBalance(find(balanceKey, token1), symbol1),
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
      help: renderBalance(find(balanceKey, token2), symbol2),
      focused: type === Type.BUY && select.isOpen,
    },
  })

  /* confirm */
  const belief = {
    [Type.BUY]: decimal(simulated?.price, 18),
    [Type.SELL]: decimal(div(1, simulated?.price), 18),
  }[type]

  const minimumReceived = simulated
    ? calc.minimumReceived({
        offer_amount: amount1,
        belief_price: belief,
        max_spread: String(MAX_SPREAD),
        commission: find(infoKey, token2),
      })
    : "0"

  const contents = !(value1 && token)
    ? undefined
    : [
        {
          title: (
            <TooltipIcon content={Tooltip.Trade.Price}>
              Terraswap Price
            </TooltipIcon>
          ),
          content: (
            <Count format={format} symbol={UUSD}>
              {simulated?.price}
            </Count>
          ),
        },
        {
          title: (
            <TooltipIcon content={Tooltip.Trade.MinimumReceived}>
              Minimum Received
            </TooltipIcon>
          ),
          content: <Count symbol={symbol2}>{minimumReceived}</Count>,
        },
      ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const asset = toToken({ token: token1, amount: amount1 })
  const swap = {
    belief_price: belief,
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

  /* result */
  const parseTx = useTradeReceipt(type)

  const container = { tab, attrs, contents, data, disabled, messages, parseTx }
  const tax = { pretax: uusd, deduct: type === Type.SELL }

  return (
    <FormContainer {...container} {...tax}>
      <FormGroup {...fields[Key.value1]} />
      <FormIcon name="arrow_downward" />
      <FormGroup {...fields[Key.value2]} />
    </FormContainer>
  )
}

export default TradeForm
