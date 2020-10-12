import React, { useRef } from "react"
import { useLocation } from "react-router-dom"
import { MsgSend } from "@terra-money/terra.js"

import useNewContractMsg from "../terra/useNewContractMsg"
import { UUSD } from "../constants"
import { gt } from "../libs/math"
import { formatAsset, toAmount } from "../libs/parse"
import { useRefetch } from "../hooks"
import { useWallet, useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"

import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormGroup from "./FormGroup"

enum Key {
  to = "to",
  value = "value",
  symbol = "symbol",
  memo = "memo",
}

const SendForm = ({ tab }: { tab: Tab }) => {
  const priceKey = PriceKey.ORACLE
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ symbol: string }>()
  const { address } = useWallet()
  const { getListedItem } = useContractsAddress()
  const { find } = useContract()
  useRefetch([priceKey, balanceKey])

  /* form:validate */
  const validate = ({ to, symbol, value, memo }: Values<Key>) => {
    const max = find(balanceKey, symbol)

    return {
      [Key.to]: v.address(to),
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.symbol]: v.required(symbol),
      [Key.memo]: v.length(memo, { max: 256 }, "Memo"),
    }
  }

  /* form:hook */
  const initial = {
    [Key.to]: "",
    [Key.value]: "",
    [Key.symbol]: state?.symbol ?? "",
    [Key.memo]: "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { to, value, symbol, memo } = values
  const amount = toAmount(value)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null!)
  const onSelect = (symbol: string) => {
    setValue(Key.symbol, symbol)
    !value && valueRef.current.focus()
  }

  /* render:form */
  const config: Config = {
    balanceKey,
    value: symbol,
    onSelect,
    useUST: true,
  }

  const select = useSelectAsset(config)
  const fields = {
    ...getFields({
      [Key.to]: {
        label: "Send to",
        input: { placeholder: "Terra address", autoFocus: true },
      },

      [Key.value]: {
        label: "Balance",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          ref: valueRef,
        },
        unit: select.button,
        assets: select.assets,
        help: renderBalance(find(balanceKey, symbol), symbol),
        focused: select.isOpen,
      },

      [Key.memo]: {
        label: "Memo (optional)",
        input: { placeholder: "" },
      },
    }),
  }

  /* confirm */
  const confirm = {
    contents: [
      {
        title: fields[Key.to].label,
        content: to,
      },
      {
        title: fields[Key.value].label,
        content: formatAsset(amount, symbol),
      },
      {
        title: fields[Key.memo].label,
        content: memo,
      },
    ].filter(({ content }) => content),
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { token } = getListedItem(symbol)

  const data =
    gt(amount, 0) && symbol
      ? symbol === UUSD
        ? [new MsgSend(address, to, amount + symbol)]
        : [newContractMsg(token, { transfer: { recipient: to, amount } })]
      : []

  const disabled = invalid

  const container = {
    confirm,
    data,
    memo,
    disabled,
    tab,
    label: "send",
    attrs,
    parserKey: "send",
  }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.to]} />
      <FormGroup {...fields[Key.value]} />
      <FormGroup {...fields[Key.memo]} />
    </FormContainer>
  )
}

export default SendForm
