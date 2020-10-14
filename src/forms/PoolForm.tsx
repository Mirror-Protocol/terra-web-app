import React, { useRef } from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, UST, UUSD } from "../constants"
import { plus, minus, times, div, floor, max, gt, gte, lt } from "../libs/math"
import { insertIf } from "../libs/utils"
import { percent } from "../libs/num"
import calc from "../helpers/calc"
import { useRefetch } from "../hooks"
import { format, formatAsset } from "../libs/parse"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey, AssetInfoKey } from "../hooks/contractKeys"
import { parsePairPool } from "../graphql/useNormalize"

import Count from "../components/Count"
import { Type } from "../pages/Pool"
import getLpName from "../pages/Stake/getLpName"
import { validate as v, placeholder, step, toBase64 } from "./formHelpers"
import { renderBalance } from "./formHelpers"
import useForm from "./useForm"
import useSelectAsset from "./useSelectAsset"
import FormContainer from "./FormContainer"
import FormGroup from "./FormGroup"
import FormIcon from "./FormIcon"

enum Key {
  symbol = "symbol",
  value = "value",
}

const PoolForm = ({ type, tab }: { type: Type; tab: Tab }) => {
  const infoKey = AssetInfoKey.LPTOTALSUPPLY
  const priceKey = PriceKey.PAIR
  const balanceKey = {
    [Type.PROVIDE]: BalanceKey.TOKEN,
    [Type.WITHDRAW]: BalanceKey.LPSTAKABLE,
  }[type]

  /* context */
  const { getListedItem, toToken } = useContractsAddress()
  const { parsed, find } = useContract()
  useRefetch([priceKey, balanceKey, infoKey])

  /* form:validate */
  const validate = ({ value, symbol }: Values<Key>) => {
    const max = find(balanceKey, symbol)

    return {
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.symbol]: v.required(symbol),
    }
  }

  /* form:hook */
  const initial = { [Key.value]: "", [Key.symbol]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value, symbol } = values
  const amount = toAmount(value)
  const price = find(priceKey, symbol)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null!)
  const onSelect = (symbol: string) => {
    setValue(Key.symbol, symbol)
    !value && valueRef.current.focus()
  }

  /* estimate:uusd */
  const balance = find(balanceKey, symbol)
  const { token, pair, lpToken } = getListedItem(symbol)
  const estimated = price && gt(amount, 0) ? floor(times(amount, price)) : ""

  /* estimate:result */
  const expectLP = (pairPool: PairPool) => {
    const { uusd, asset, total } = parsePairPool(pairPool)
    const deposits = [
      { amount, pair: asset },
      { amount: estimated, pair: uusd },
    ]

    return calc.toLP(deposits, total)
  }

  const expectReturn = (pairPool: PairPool): { asset: Asset; uusd: Asset } => {
    const { uusd, asset, total } = parsePairPool(pairPool)

    const shares = {
      asset: { amount: asset, symbol },
      uusd: { amount: uusd, symbol: UUSD },
    }

    return calc.fromLP(amount, shares, total)
  }

  const pairPool = parsed[PriceKey.PAIR]?.[token]
  const lpFromTx = pairPool ? expectLP(pairPool) : undefined
  const returnFromTx = pairPool ? expectReturn(pairPool) : undefined

  const uusd = {
    [Type.PROVIDE]: estimated,
    [Type.WITHDRAW]: returnFromTx?.uusd.amount,
  }[type]

  const lpAfterTx = {
    [Type.PROVIDE]: plus(balance, lpFromTx ?? "0"),
    [Type.WITHDRAW]: max([minus(balance, amount), "0"]),
  }[type]

  /* share of pool */
  const minimum = div(0.01, 100) // <0.01%
  const total = find(infoKey, symbol)
  const share = {
    [Type.PROVIDE]: div(lpAfterTx, plus(total, lpFromTx ?? "0")),
    [Type.WITHDRAW]: div(lpAfterTx, minus(total, amount)),
  }[type]

  /* render:form */
  const config = {
    value: symbol,
    onSelect,
    priceKey,
    balanceKey,
    formatTokenName: type === Type.WITHDRAW ? getLpName : undefined,
  }

  const select = useSelectAsset(config)

  const fields = {
    ...getFields({
      [Key.value]: {
        label: "Input",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          ref: valueRef,
        },
        unit: select.button,
        assets: select.assets,
        help: renderBalance(balance, symbol),
        focused: type === Type.WITHDRAW && select.isOpen,
      },
    }),

    estimated: {
      [Type.PROVIDE]: {
        label: `Input ${UST}`,
        value: estimated ? formatAsset(estimated, UUSD) : "-",
        help: renderBalance(find(balanceKey, UUSD), UUSD, UST),
      },
      [Type.WITHDRAW]: {
        label: "Output",
        value: returnFromTx
          ? Object.values(returnFromTx)
              ?.map(({ amount, symbol }) => formatAsset(amount, symbol))
              .join(" + ")
          : "-",
      },
    }[type],
  }

  const icons = {
    [Type.PROVIDE]: <FormIcon name="add" />,
    [Type.WITHDRAW]: <FormIcon name="arrow_downward" />,
  }

  /* confirm */
  const prefix = gt(share, 0) && lt(share, minimum) ? "<" : ""
  const contents = [
    {
      title: "Pool Price",
      content: (
        <Count format={format} symbol={UUSD}>
          {price}
        </Count>
      ),
    },
    ...insertIf(type === Type.PROVIDE, {
      title: "LP from Tx",
      content: <Count symbol={LP}>{lpFromTx}</Count>,
    }),
    ...insertIf(type === Type.WITHDRAW || gt(balance, 0), {
      title: "LP after tx",
      content: <Count symbol={LP}>{lpAfterTx}</Count>,
    }),
    {
      title: "Pool Share",
      content: (
        <Count format={(value) => `${prefix}${percent(value)}`}>
          {!gt(share, 0) ? "0" : gte(share, minimum) ? share : minimum}
        </Count>
      ),
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = !estimated
    ? []
    : {
        [Type.PROVIDE]: [
          newContractMsg(token, {
            increase_allowance: { amount, spender: pair },
          }),
          newContractMsg(
            pair,
            {
              provide_liquidity: {
                assets: [
                  toToken({ amount, symbol }),
                  toToken({ amount: estimated, symbol: UUSD }),
                ],
              },
            },
            { amount: estimated, denom: UUSD }
          ),
        ],
        [Type.WITHDRAW]: [
          newContractMsg(lpToken, {
            send: {
              amount,
              contract: pair,
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ],
      }[type]

  const disabled =
    invalid || (type === Type.PROVIDE && gt(estimated, find(balanceKey, UUSD)))

  const container = { contents, data, disabled, tab, attrs }
  const tax = { pretax: uusd, deduct: type === Type.WITHDRAW }

  return (
    <FormContainer {...container} {...tax} parserKey="pool">
      <FormGroup {...fields[Key.value]} />
      {icons[type]}
      <FormGroup {...fields["estimated"]} />
    </FormContainer>
  )
}

export default PoolForm
