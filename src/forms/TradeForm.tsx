import { useRef, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { isNil } from "ramda"

import useNewContractMsg from "../libs/useNewContractMsg"
import { COMMISSION } from "../constants"
import Tooltips from "../lang/Tooltips"
import { div, gt, times } from "../libs/math"
import { dp, format, lookup, lookupSymbol } from "../libs/parse"
import { decimal } from "../libs/parse"
import { toAmount } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { placeholder, step } from "../libs/formHelpers"
import { validate as v } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import calc from "../libs/calc"
import { useProtocol } from "../data/contract/protocol"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import useTax from "../hooks/useTax"
import { useFindBalance } from "../data/contract/normalize"
import { useFindPrice } from "../data/contract/normalize"
import { slippageQuery } from "../data/tx/slippage"

import FormGroup from "../components/FormGroup"
import Formatted from "../components/Formatted"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import DelistModal from "../layouts/DelistModal"
import { TradeType } from "../types/Types"
import useTradeReceipt from "./receipts/useTradeReceipt"
import useLimitOrderReceipt from "./receipts/useLimitOrderReceipt"
import { toBase64 } from "../libs/formHelpers"
import useSimulate from "./modules/useSimulate"
import useSelectAsset from "./modules/useSelectAsset"
import FormContainer from "./modules/FormContainer"
import FormIcon from "./modules/FormIcon"
import SetSlippageTolerance from "./modules/SetSlippageTolerance"
import ToggleLimitOrder from "./modules/ToggleLimitOrder"
import styles from "./TradeForm.module.scss"

enum Key {
  token = "token",
  target = "target",
  value1 = "value1",
  value2 = "value2",
}

const TradeForm = ({ type }: { type: TradeType }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { contracts, whitelist, delist, ...helpers } = useProtocol()
  const { getToken, getSymbol, toToken } = helpers
  const { contents: findBalance } = useFindBalance()
  const findPrice = useFindPrice() // to validate target price (limit order)

  /* form:limit */
  const limitOrderState = useState(false)
  const [isLimitOrder] = limitOrderState

  /* form:slippage */
  const slippage = useRecoilValue(slippageQuery)

  /* form:validate */
  const validate = ({ target, value1, value2, token }: Values<Key>) => {
    const token1 = { [TradeType.BUY]: "uusd", [TradeType.SELL]: token }[type]
    const token2 = { [TradeType.BUY]: token, [TradeType.SELL]: "uusd" }[type]
    const symbol1 = getSymbol(token1)
    const symbol2 = getSymbol(token2)
    const max = findBalance(token1)
    const price = findPrice(priceKey, token)
    const targetRangeKey = { [TradeType.BUY]: "max", [TradeType.SELL]: "min" }[
      type
    ]

    return {
      [Key.value1]: v.amount(value1, { symbol: symbol1, max }),
      [Key.value2]: !token ? "" : v.amount(value2, { symbol: symbol2 }),
      [Key.token]: v.required(token),
      [Key.target]: !target
        ? ""
        : v.amount(target, { [targetRangeKey]: price }, "Target price"),
    }
  }

  /* form:hook */
  const initial = {
    [Key.target]: "",
    [Key.value1]: "",
    [Key.value2]: "",
    [Key.token]: state?.token ?? getToken("MIR"),
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid } = form
  const { value1, value2, token, target } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)
  const token1 = { [TradeType.BUY]: "uusd", [TradeType.SELL]: token }[type]
  const token2 = { [TradeType.BUY]: token, [TradeType.SELL]: "uusd" }[type]
  const symbol = getSymbol(token)
  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)
  const uusd = { [TradeType.BUY]: amount1, [TradeType.SELL]: amount2 }[type]

  /* form:focus input on select asset */
  const value1Ref = useRef<HTMLInputElement>(null)
  const value2Ref = useRef<HTMLInputElement>(null)
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value1 && value1Ref.current?.focus()
  }

  /* clear target price on limit order change */
  useEffect(() => {
    setValues((values) => ({ ...values, [Key.target]: "" }))
  }, [isLimitOrder, setValues])

  /* simulation */
  const { pair } = whitelist[token] ?? {}
  const buying = type === TradeType.BUY
  const selling = type === TradeType.SELL
  const reverse = form.changed === Key.value2

  const simulationParams = Object.assign(
    { pair, type, reverse },
    !reverse
      ? { amount: amount1, token: token1 }
      : { amount: amount2, token: token2 }
  )

  const simulation = useSimulate(simulationParams, isLimitOrder)
  const { simulated, loading: simulating, error } = simulation

  /* change another amount on simulate */
  useEffect(() => {
    const key = isLimitOrder
      ? type === TradeType.BUY
        ? Key.value1
        : Key.value2
      : reverse
      ? Key.value1
      : Key.value2
    const symbol = reverse ? symbol1 : symbol2
    const targetAmount = {
      [TradeType.BUY]: times(value2, target),
      [TradeType.SELL]: times(value1, target),
    }[type]

    const next = isLimitOrder
      ? decimal(targetAmount || "0", dp())
      : simulated
      ? lookup(simulated.amount, symbol)
      : error && ""

    // Safe to use as deps
    !isNil(next) && setValues((values) => ({ ...values, [key]: next }))

    // eslint-disable-next-line
  }, [
    isLimitOrder,
    simulated,
    reverse,
    setValues,
    type,
    target,
    value1,
    value2,
    symbol1,
    symbol2,
    error,
  ])

  /* render:form */
  const balance = findBalance(token1)
  const config = { token, onSelect, priceKey, balanceKey }
  const select = useSelectAsset(config)
  const delisted = whitelist[token1]?.["status"] === "DELISTED"

  const { getMax } = useTax()
  const max = {
    [TradeType.BUY]: lookup(getMax(balance), "uusd"),
    [TradeType.SELL]: lookup(balance, symbol),
  }[type]

  const targetLabel = { [TradeType.BUY]: "Bid", [TradeType.SELL]: "Ask" }[type]
  const fields = getFields({
    [Key.target]: {
      label: "at",
      input: {
        type: "number",
        step: step("uusd"),
        placeholder: placeholder("uusd"),
      },
      unit: `UST per ${symbol}`,
      help: {
        title: "Terraswap Price",
        content: format(findPrice(priceKey, token)),
      },
    },
    [Key.value1]: {
      label: !isLimitOrder
        ? { [TradeType.BUY]: "Pay", [TradeType.SELL]: "Sell" }[type]
        : { [TradeType.BUY]: "and pay", [TradeType.SELL]: "Order to sell" }[
            type
          ],
      input:
        isLimitOrder && buying
          ? undefined
          : {
              type: "number",
              step: step(symbol1),
              placeholder: placeholder(symbol1),
              disabled: reverse && simulating,
              autoFocus: true,
              ref: value1Ref,
            },
      value: isLimitOrder && buying ? value1 : undefined,
      unit: {
        [TradeType.BUY]: lookupSymbol(symbol1),
        [TradeType.SELL]: delisted ? symbol1 : select.button,
      }[type],
      max:
        (isLimitOrder && buying) || !gt(max, 0)
          ? undefined
          : () => setValue(Key.value1, max),
      assets: type === TradeType.SELL && select.assets,
      help: renderBalance(findBalance(token1), symbol1),
      focused: type === TradeType.SELL && select.isOpen,
    },

    [Key.value2]: {
      label: !isLimitOrder
        ? { [TradeType.BUY]: "to buy", [TradeType.SELL]: "to get" }[type]
        : { [TradeType.BUY]: "Order to buy", [TradeType.SELL]: "and get" }[
            type
          ],
      input:
        isLimitOrder && selling
          ? undefined
          : {
              type: "number",
              step: step(symbol2),
              placeholder: placeholder(symbol2),
              disabled: !reverse && simulating,
              ref: value2Ref,
            },
      value: isLimitOrder && selling ? value2 : undefined,
      unit: {
        [TradeType.BUY]: select.button,
        [TradeType.SELL]: lookupSymbol(symbol2),
      }[type],
      assets: type === TradeType.BUY && select.assets,
      help: renderBalance(findBalance(token2), symbol2),
      focused: type === TradeType.BUY && select.isOpen,
    },
  })

  /* confirm */
  const belief = {
    [TradeType.BUY]: decimal(simulated?.price, 18),
    [TradeType.SELL]: decimal(div(1, simulated?.price), 18),
  }[type]

  const minimumReceived = simulated
    ? calc.minimumReceived({
        offer_amount: amount1,
        belief_price: belief,
        max_spread: String(slippage),
        commission: String(COMMISSION),
      })
    : "0"

  const contents = !(value1 && token)
    ? undefined
    : isLimitOrder
    ? []
    : [
        {
          title: (
            <TooltipIcon content={Tooltips.Trade.Price}>
              Expected Price
            </TooltipIcon>
          ),
          content: (
            <Formatted format={format} symbol="uusd" noCount>
              {simulated?.price}
            </Formatted>
          ),
        },
        {
          title: (
            <TooltipIcon content={Tooltips.Trade.MinimumReceived}>
              Minimum Received
            </TooltipIcon>
          ),
          content: <Formatted symbol={symbol2}>{minimumReceived}</Formatted>,
        },
      ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const asset1 = toToken({ token: token1, amount: amount1 })
  const asset2 = toToken({ token: token2, amount: amount2 })
  const swap = { belief_price: belief, max_spread: slippage }

  const limitOrderContract = contracts["limitOrder"]
  const limitOrderData = limitOrderContract
    ? {
        [TradeType.BUY]: [
          newContractMsg(
            limitOrderContract,
            { submit_order: { offer_asset: asset1, ask_asset: asset2 } },
            { amount: amount1, denom: "uusd" }
          ),
        ],
        [TradeType.SELL]: [
          newContractMsg(token, {
            send: {
              contract: limitOrderContract,
              amount: amount1,
              msg: toBase64({ submit_order: { ask_asset: asset2 } }),
            },
          }),
        ],
      }[type]
    : []

  const data = isLimitOrder
    ? limitOrderData
    : {
        [TradeType.BUY]: [
          newContractMsg(
            pair,
            { swap: { ...swap, offer_asset: asset1 } },
            { amount: amount1, denom: "uusd" }
          ),
        ],
        [TradeType.SELL]: [
          newContractMsg(token, {
            send: { amount: amount1, contract: pair, msg: toBase64({ swap }) },
          }),
        ],
      }[type]

  const limitOrderValue = {
    [TradeType.BUY]: times(target, amount2),
    [TradeType.SELL]: times(target, amount1),
  }[type]

  const isLimitOrderValueEnough = gt(limitOrderValue, 1e6)

  const limitOrderMessages = !target
    ? [`${targetLabel} price is required`]
    : !isLimitOrderValueEnough
    ? ["Order value must be greater than 1 UST"]
    : undefined

  const messages = simulating
    ? undefined
    : error
    ? ["Simulation failed"]
    : isLimitOrder
    ? limitOrderMessages
    : undefined

  const disabled = invalid || simulating || !!messages?.length

  /* result */
  const parseTrade = useTradeReceipt(type, simulated?.price)
  const parseLimitOrder = useLimitOrderReceipt(type)
  const parseTx = isLimitOrder ? parseLimitOrder : parseTrade

  const container = { attrs, contents, data, disabled, messages, parseTx }
  const tax = { pretax: uusd, deduct: type === TradeType.SELL }

  return (
    <WithPriceChart token={token}>
      {type === TradeType.BUY && !!delist[token] && (
        <DelistModal tokens={[token]} key={token} />
      )}

      <FormContainer {...container} {...tax}>
        <div className={styles.header}>
          <ToggleLimitOrder state={limitOrderState} />
          {!isLimitOrder && <SetSlippageTolerance />}
        </div>

        {isLimitOrder ? (
          {
            [TradeType.BUY]: (
              <>
                <FormGroup {...fields[Key.value2]} />
                <FormGroup {...fields[Key.target]} />
                <FormGroup {...fields[Key.value1]} />
              </>
            ),
            [TradeType.SELL]: (
              <>
                <FormGroup {...fields[Key.value1]} />
                <FormGroup {...fields[Key.target]} />
                <FormGroup {...fields[Key.value2]} />
              </>
            ),
          }[type]
        ) : (
          <>
            <FormGroup {...fields[Key.value1]} />
            <FormIcon name="ArrowDown" />
            <FormGroup {...fields[Key.value2]} />
          </>
        )}
      </FormContainer>
    </WithPriceChart>
  )
}

export default TradeForm
