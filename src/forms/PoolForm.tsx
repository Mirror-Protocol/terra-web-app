import React, { useRef } from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, UST, UUSD } from "../constants"
import { minus, times, div, floor, max, gt, lt, plus } from "../libs/math"
import { percent } from "../libs/num"
import calc from "../helpers/calc"
import { useRefetch } from "../hooks"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract } from "../hooks"
import { PriceKey, BalanceKey, AssetInfoKey } from "../hooks/contractKeys"
import { parsePairPool } from "../graphql/useNormalize"
import { DlFooter } from "../components/Dl"

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
  const priceKey = PriceKey.PAIR
  const infoKey = AssetInfoKey.LPTOTALSUPPLY
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
  const expect = (pairPool: PairPool): { lp?: string; assets?: Asset[] } => {
    const { uusd, asset, total } = parsePairPool(pairPool)
    const deposits = [
      { amount, pair: asset },
      { amount: estimated, pair: uusd },
    ]

    const shares = [
      { amount: asset, symbol },
      { amount: uusd, symbol: UUSD },
    ]

    return {
      [Type.PROVIDE]: { lp: calc.toLP(deposits, total) },
      [Type.WITHDRAW]: { assets: calc.fromLP(amount, shares, total) },
    }[type]
  }

  const pairPool = parsed[PriceKey.PAIR]?.[token]
  const expected = pairPool ? expect(pairPool) : undefined
  const expectedFormatted =
    expected &&
    {
      [Type.PROVIDE]: formatAsset(expected.lp, LP),
      [Type.WITHDRAW]: expected.assets
        ?.map(({ amount, symbol }) => formatAsset(amount, symbol))
        .join(" + "),
    }[type]

  /* withdraw */
  const lpAfterTx = max([minus(balance, amount), "0"])

  /* share of pool */
  const minimum = div(0.01, 100)
  const total = find(infoKey, symbol)
  const share = {
    [Type.PROVIDE]: expected ? div(expected.lp, plus(total, expected.lp)) : "0",
    [Type.WITHDRAW]: div(lpAfterTx, minus(total, balance)),
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
        value: expectedFormatted ?? "-",
      },
    }[type],
  }

  const icons = {
    [Type.PROVIDE]: <FormIcon name="add" />,
    [Type.WITHDRAW]: <FormIcon name="arrow_downward" />,
  }

  const footer = [
    {
      title: "Pool Ratio",
      content: `1 ${lookupSymbol(symbol)} ≈ ${format(price)} ${UST}`,
    },
    {
      [Type.PROVIDE]: {
        title: "LP from transaction",
        content: expectedFormatted,
      },
      [Type.WITHDRAW]: {
        title: "LP after transaction",
        content: formatAsset(lpAfterTx, LP),
      },
    }[type],
    {
      title: "Pool Share",
      content: !gt(share, 0)
        ? percent("0")
        : lt(share, minimum)
        ? `<${percent(minimum)}`
        : percent(share),
    },
  ]

  /* confirm */
  const confirm = {
    [Type.PROVIDE]: {
      contents: [
        {
          title: "Expected LP tokens",
          content: expectedFormatted,
        },
        {
          title: "mAsset deposit amount",
          content: formatAsset(amount, symbol),
        },
        {
          title: "UST deposit amount",
          content: formatAsset(estimated, UUSD),
        },
        {
          title: "Estimated exchange rate",
          content: `1 ${lookupSymbol(symbol)} ≈ ${lookup(price)} ${UST}`,
        },
      ],
    },
    [Type.WITHDRAW]: {
      contents: [
        {
          title: "Withdrawn LP tokens",
          content: `${format(amount, symbol)} ${getLpName(symbol)}`,
        },
        {
          title: "Estimated return amount",
          content: expectedFormatted,
        },
        {
          title: "LP balance after transaction",
          content: formatAsset(lpAfterTx, LP),
        },
        {
          title: "Estimated exchange rate",
          content: `1 ${lookupSymbol(symbol)} ≈ ${lookup(price)} ${UST}`,
        },
      ],
    },
  }[type]

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
  const container = { confirm, data, disabled, tab, attrs, parserKey: "pool" }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value]} />
      {icons[type]}
      <FormGroup {...fields["estimated"]} />
      {symbol && <DlFooter list={footer} margin />}
    </FormContainer>
  )
}

export default PoolForm
