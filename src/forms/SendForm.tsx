import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AccAddress, MsgSend } from "@terra-money/terra.js"
import { ethers } from "ethers"

import useNewContractMsg from "../libs/useNewContractMsg"
import Tooltips from "../lang/Tooltips"
import { div, gt, max, minus, times } from "../libs/math"
import { formatAsset, lookup, lookupSymbol, toAmount } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useNetwork } from "../hooks"
import { useAddress } from "../hooks"
import { useProtocol } from "../data/contract/protocol"
import { PriceKey } from "../hooks/contractKeys"
import useTax from "../hooks/useTax"
import { useFindBalance } from "../data/contract/normalize"
import { useFindPrice } from "../data/contract/normalize"

import FormGroup from "../components/FormGroup"
import { TooltipIcon } from "../components/Tooltip"
import Container from "../components/Container"
import useSendReceipt from "./receipts/useSendReceipt"
import FormContainer from "./modules/FormContainer"
import useSelectAsset, { Config } from "./modules/useSelectAsset"

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

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { shuttle } = useNetwork()
  const address = useAddress()
  const { getSymbol } = useProtocol()

  const { contents: findBalance } = useFindBalance()
  const findPrice = useFindPrice() // to calc shuttle fee

  /* form:validate */
  const getIsShuttleAvailable = (network: string, token: string) =>
    !network || !!shuttleList[network as ShuttleNetwork]?.[token]

  const validate = ({ to, token, value, memo, network }: Values<Key>) => {
    const max = findBalance(token)
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
  const uusd = token === "uusd" ? amount : undefined
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
  const valueRef = useRef<HTMLInputElement>(null)
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value && valueRef.current?.focus()
  }

  /* render:form */
  const config: Config = { token, onSelect, native: ["uusd"] }
  const select = useSelectAsset(config)
  const balance = findBalance(token)

  const { getMax } = useTax()
  const maxAmount =
    symbol === "uusd"
      ? lookup(getMax(balance), "uusd")
      : lookup(balance, symbol)

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
        max: gt(maxAmount, 0)
          ? () => setValue(Key.value, maxAmount)
          : undefined,
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
  const price = findPrice(priceKey, token)
  const shuttleMinimum = div(1e6, price)
  const shuttleMinimumText = formatAsset(shuttleMinimum, symbol)
  const shuttleEnough = !network || gt(amount, shuttleMinimum)
  const shuttleFee = max([times(amount, 0.001), shuttleMinimum])
  const amountAfterShuttleFee = max([minus(amount, shuttleFee), String(0)])

  const contents = !value
    ? undefined
    : network
    ? [
        {
          title: (
            <TooltipIcon content={Tooltips.Send.ShuttleFee}>
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
    : symbol === "uusd"
    ? [new MsgSend(address, recipient, amount + symbol)]
    : [newContractMsg(token, { transfer: { recipient, amount } })]

  const isShuttleAvailable = getIsShuttleAvailable(network, token)
  const messages = !isShuttleAvailable
    ? [`${lookupSymbol(symbol)} is not available on ${getNetworkName(network)}`]
    : !shuttleEnough
    ? [`Transactions must be larger than ${shuttleMinimumText}`]
    : isTerra
    ? ["Double check if the above transaction requires a memo"]
    : []

  const disabled = invalid || !isShuttleAvailable || !shuttleEnough

  /* result */
  const parseTx = useSendReceipt()

  const container = { tab, attrs, contents, messages, disabled, data, memo }

  return (
    <Container sm>
      <FormContainer
        {...container}
        label="send"
        pretax={uusd}
        parseTx={parseTx}
      >
        <FormGroup {...fields[Key.network]} />
        <FormGroup {...fields[Key.to]} />
        <FormGroup {...fields[Key.value]} />
        {isTerra && <FormGroup {...fields[Key.memo]} />}
      </FormContainer>
    </Container>
  )
}

export default SendForm
