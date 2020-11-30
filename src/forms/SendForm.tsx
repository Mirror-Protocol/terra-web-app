import { useRef } from "react"
import { useLocation } from "react-router-dom"
import { AccAddress, MsgSend } from "@terra-money/terra.js"
import { ethers } from "ethers"

import useNewContractMsg from "../terra/useNewContractMsg"
import { UUSD } from "../constants"
import { gt } from "../libs/math"
import { toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useNetwork, useRefetch } from "../hooks"
import { useWallet, useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import useSendReceipt from "./receipts/useSendReceipt"
import FormContainer from "./FormContainer"
import useSelectAsset, { Config } from "./useSelectAsset"

enum Key {
  to = "to",
  value = "value",
  token = "token",
  memo = "memo",
}

const SendForm = ({ tab }: { tab: Tab }) => {
  const priceKey = PriceKey.ORACLE
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { shuttle } = useNetwork()
  const { address } = useWallet()
  const { getSymbol } = useContractsAddress()
  const { find } = useContract()
  useRefetch([priceKey, balanceKey])

  /* form:validate */
  const validate = ({ to, token, value, memo }: Values<Key>) => {
    const max = find(balanceKey, token)
    const symbol = getSymbol(token)

    return {
      [Key.to]: v.address(to, [AccAddress.validate, ethers.utils.isAddress]),
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.token]: v.required(token),
      [Key.memo]: ["<", ">"].some((char) => memo.includes(char))
        ? "Memo includes invalid bracket"
        : v.length(memo, { max: 256 }, "Memo"),
    }
  }

  /* form:hook */
  const initial = {
    [Key.to]: "",
    [Key.value]: "",
    [Key.token]: state?.token ?? "",
    [Key.memo]: "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { to, value, token, memo: $memo } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)
  const uusd = token === UUSD ? amount : undefined
  const isEthereum = ethers.utils.isAddress(to)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null!)
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value && valueRef.current.focus()
  }

  /* render:form */
  const config: Config = {
    balanceKey,
    token,
    onSelect,
    useUST: true,
  }

  const select = useSelectAsset(config)
  const fields = {
    ...getFields({
      [Key.to]: {
        label: "Send to",
        input: {
          placeholder: "Terra address or Ethereum address",
          autoFocus: true,
        },
        unit: isEthereum && "Ethereum",
      },

      [Key.value]: {
        label: "Amount",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          ref: valueRef,
        },
        unit: select.button,
        assets: select.assets,
        help: renderBalance(find(balanceKey, token), symbol),
        focused: select.isOpen,
      },

      [Key.memo]: {
        label: "Memo (optional)",
        input: { placeholder: "" },
      },
    }),
  }

  /* confirm */
  const contents = value ? [] : undefined

  /* submit */
  const recipient = !isEthereum ? to : shuttle
  const memo = !isEthereum ? $memo : to

  const newContractMsg = useNewContractMsg()

  const data = !(gt(amount, 0) && token)
    ? []
    : symbol === UUSD
    ? [new MsgSend(address, recipient, amount + symbol)]
    : [newContractMsg(token, { transfer: { recipient, amount } })]

  const disabled = invalid

  /* result */
  const parseTx = useSendReceipt()

  const container = { tab, attrs, contents, disabled, data, memo, parseTx }

  return (
    <FormContainer {...container} pretax={uusd} label="send">
      <FormGroup {...fields[Key.to]} />
      <FormGroup {...fields[Key.value]} />
      {!isEthereum && <FormGroup {...fields[Key.memo]} />}
    </FormContainer>
  )
}

export default SendForm
