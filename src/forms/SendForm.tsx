import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AccAddress, MsgSend } from "@terra-money/terra.js"
import { ethers } from "ethers"

import useNewContractMsg from "../terra/useNewContractMsg"
import { UUSD } from "../constants"
import Tooltip from "../lang/Tooltip.json"
import { div, gt, max, minus, times } from "../libs/math"
import { formatAsset, lookup, lookupSymbol, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useNetwork, useRefetch } from "../hooks"
import { useWallet, useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import { TooltipIcon } from "../components/Tooltip"
import useSendReceipt from "./receipts/useSendReceipt"
import FormContainer from "./FormContainer"
import useSelectAsset, { Config } from "./useSelectAsset"

enum Key {
  to = "to",
  value = "value",
  token = "token",
  memo = "memo",
  network = "network",
}

const getNetworkName = (value: string) => {
  const NetworkName: Record<ShuttleNetwork, string> = {
    ethereum: "Ethereum",
    bsc: "Binance Smart Chain",
  }

  return value ? NetworkName[value as ShuttleNetwork] : "Terra"
}

interface Props {
  tab: Tab
  shuttleList: ShuttleList
}

const SendForm = ({ tab, shuttleList }: Props) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { shuttle } = useNetwork()
  const { address } = useWallet()
  const { getSymbol } = useContractsAddress()
  const { find } = useContract()
  useRefetch([priceKey, balanceKey])

  /* form:validate */
  const getIsShuttleAvailable = (network: string, symbol: string) =>
    !network || !!shuttleList[network as ShuttleNetwork]?.[lookupSymbol(symbol)]

  const validate = ({ to, token, value, memo, network }: Values<Key>) => {
    const max = find(balanceKey, token)
    const symbol = getSymbol(token)

    return {
      [Key.to]: v.address(to, [AccAddress.validate, ethers.utils.isAddress]),
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.token]: v.required(token),
      [Key.memo]: ["<", ">"].some((char) => memo.includes(char))
        ? "Memo includes invalid bracket"
        : v.length(memo, { max: 256 }, "Memo"),
      [Key.network]: !ethers.utils.isAddress(to) ? "" : v.required(network),
    }
  }

  /* form:hook */
  const initial = {
    [Key.to]: "",
    [Key.value]: "",
    [Key.token]: state?.token ?? "",
    [Key.memo]: "",
    [Key.network]: "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid } = form
  const { to, value, token, memo: $memo, network } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)
  const uusd = token === UUSD ? amount : undefined
  const isEthereum = ethers.utils.isAddress(to)
  const isTerra = AccAddress.validate(to)

  useEffect(() => {
    isEthereum &&
      !network &&
      setValues((values) => ({ ...values, [Key.network]: "ethereum" }))

    isTerra &&
      network &&
      setValues((values) => ({ ...values, [Key.network]: "" }))
  }, [isEthereum, isTerra, network, setValues])

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
  const balance = find(balanceKey, token)

  const fields = {
    ...getFields({
      [Key.network]: {
        label: "Network",
        select: (
          <select
            value={network}
            onChange={(e) => setValue(Key.network, e.target.value)}
            style={{ width: "100%" }}
          >
            {["", "ethereum", "bsc"].map((value) => (
              <option
                value={value}
                disabled={value ? isTerra : isEthereum}
                key={value}
              >
                {getNetworkName(value)}
              </option>
            ))}
          </select>
        ),
      },

      [Key.to]: {
        label: "Send to",
        input: {
          placeholder: `${getNetworkName(network)} address`,
          autoFocus: true,
        },
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
        max:
          symbol === UUSD
            ? undefined
            : () => setValue(Key.value, lookup(balance, symbol)),
        assets: select.assets,
        help: renderBalance(balance, symbol),
        focused: select.isOpen,
      },

      [Key.memo]: {
        label: "Memo (optional)",
        input: { placeholder: "" },
      },
    }),
  }

  /* confirm */
  const price = find(priceKey, token)
  const shuttleFee = max([times(amount, 0.001), div(1e6, price)])
  const amountAfterShuttleFee = max([minus(amount, shuttleFee), String(0)])
  const contents = !value
    ? undefined
    : network === "ethereum"
    ? [
        {
          title: (
            <TooltipIcon content={Tooltip.Send.ShuttleFee}>
              Shuttle fee (estimated)
            </TooltipIcon>
          ),
          content: formatAsset(shuttleFee, symbol),
        },
        {
          title: "Amount after Shuttle fee (estimated)",
          content: formatAsset(amountAfterShuttleFee, symbol),
        },
      ]
    : []

  /* submit */
  const recipient = !isEthereum ? to : shuttle[network as ShuttleNetwork]
  const memo = !isEthereum ? $memo : to

  const newContractMsg = useNewContractMsg()

  const data = !(gt(amount, 0) && token)
    ? []
    : symbol === UUSD
    ? [new MsgSend(address, recipient, amount + symbol)]
    : [newContractMsg(token, { transfer: { recipient, amount } })]

  const isShuttleAvailable = getIsShuttleAvailable(network, symbol)
  const messages = !isShuttleAvailable
    ? [`${lookupSymbol(symbol)} is not available on ${getNetworkName(network)}`]
    : ["Double check if the above transaction requires a memo"]

  const disabled = invalid || !isShuttleAvailable

  /* result */
  const parseTx = useSendReceipt()

  const container = { tab, attrs, contents, messages, disabled, data, memo }

  return (
    <FormContainer {...container} label="send" pretax={uusd} parseTx={parseTx}>
      <FormGroup {...fields[Key.network]} />
      <FormGroup {...fields[Key.to]} />
      <FormGroup {...fields[Key.value]} />
      {isTerra && <FormGroup {...fields[Key.memo]} />}
    </FormContainer>
  )
}

export default SendForm
