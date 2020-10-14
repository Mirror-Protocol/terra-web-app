import React, { useEffect, useRef } from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR, UUSD } from "../constants"
import { plus, minus, times, div, floor } from "../libs/math"
import { gt, gte, lt, isFinite } from "../libs/math"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { toAmount } from "../libs/parse"
import calc from "../helpers/calc"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import { BalanceKey, AccountInfoKey } from "../hooks/contractKeys"
import { MenuKey } from "../routes"

import { Type } from "../pages/Mint"
import { validate as v, placeholder, step, toBase64 } from "./formHelpers"
import { renderBalance } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormGroup from "./FormGroup"
import FormIcon from "./FormIcon"
import CollateralRatio from "./CollateralRatio"
import Dl from "../components/Dl"
import Count from "../components/Count"
import styles from "./MintForm.module.scss"

enum Key {
  value1 = "value1",
  value2 = "value2",
  symbol1 = "symbol1",
  symbol2 = "symbol2",
  ratio = "ratio",
}

interface Props {
  idx?: string
  type: Type
  tab?: Tab
}

const MintForm = ({ idx, type, tab }: Props) => {
  const priceKey = PriceKey.ORACLE
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { contracts, getListedItem, ...helpers } = useContractsAddress()
  const { parseToken, toToken, toAssetInfo } = helpers
  const { find } = useContract()
  useRefetch([balanceKey])

  /* context:position */
  const { [AccountInfoKey.MINTPOSITIONS]: positions } = useContract()
  const position = positions?.find((position) => position.idx === idx)
  const open = !position
  const close = type === Type.CLOSE

  /* form:validate */
  const max = (symbol: string) =>
    type === Type.WITHDRAW ? prevCollateral?.amount : find(balanceKey, symbol)

  const validate = ({ symbol1, symbol2, value1, ratio }: Values<Key>) => {
    const nextRatio = div(ratio, 100)

    return {
      [Key.value1]: v.amount(value1, { symbol: symbol1, max: max(symbol1) }),
      [Key.value2]: "",
      [Key.symbol1]: v.required(symbol1),
      [Key.symbol2]: open ? v.required(symbol2) : "",
      [Key.ratio]:
        prevRatio && !(type === Type.DEPOSIT ? gt : lt)(nextRatio, prevRatio)
          ? "Collateral ratio must be higher than current collateral ratio"
          : !gte(nextRatio, find(AssetInfoKey.MINCOLLATERALRATIO, symbol2))
          ? "Collateral ratio must be higher than minimum collateral ratio"
          : v.required(ratio),
    }
  }

  /* form:hook */
  const prevCollateral = position && parseToken(position.collateral)
  const prevAsset = position && parseToken(position.asset)

  const params = prevCollateral &&
    prevAsset && {
      collateral: {
        amount: prevCollateral.amount,
        price: find(priceKey, prevCollateral.symbol),
      },
      asset: {
        amount: prevAsset.amount,
        price: find(priceKey, prevAsset.symbol),
      },
    }

  const prevRatio = params && calc.mint(params).ratio

  const initial = {
    [Key.value1]:
      (close && lookup(prevCollateral?.amount, prevCollateral?.symbol)) || "",
    [Key.value2]: "",
    [Key.symbol1]: prevCollateral?.symbol ?? UUSD,
    [Key.symbol2]: prevAsset?.symbol ?? "",
    [Key.ratio]: prevRatio ? lookup(times(prevRatio, 100)) : "200",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields } = form
  const { touched, errors, attrs, invalid } = form
  const { symbol1, symbol2, value1, value2, ratio } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)
  const uusd = symbol1 === UUSD ? amount1 : "0"

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null!)
  const onSelect = (name: Key) => (symbol: string) => {
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.symbol1]: { symbol2: symbol === symbol2 ? "" : symbol2 },
      [Key.symbol2]: { symbol1: symbol === symbol1 ? "" : symbol1 },
    }

    setValues({ ...values, ...next[name], [name]: symbol })
    !value1 && valueRef.current.focus()
  }

  /* simulation */
  const price1 = find(priceKey, symbol1)
  const price2 = find(priceKey, symbol2)
  const reverse = form.changed !== Key.value1
  const nextCollateralAmount = (type === Type.DEPOSIT ? plus : minus)(
    prevCollateral?.amount,
    amount1
  )

  const calculated = calc.mint({
    collateral: {
      amount: reverse ? undefined : open ? amount1 : nextCollateralAmount,
      price: price1,
    },
    asset: {
      amount: open ? toAmount(value2) : prevAsset?.amount,
      price: price2,
    },
    ratio: open ? div(ratio, 100) : !reverse ? undefined : div(ratio, 100),
  })

  const simulated = open
    ? !reverse
      ? lookup(calculated.asset.amount, symbol2)
      : lookup(calculated.collateral.amount, symbol1)
    : !reverse
    ? lookup(times(calculated.ratio, 100))
    : lookup(
        type === Type.DEPOSIT
          ? minus(calculated.collateral.amount, prevCollateral?.amount)
          : minus(prevCollateral?.amount, calculated.collateral.amount),
        prevCollateral?.symbol
      )

  useEffect(() => {
    const key = reverse ? Key.value1 : open ? Key.value2 : Key.ratio
    const next = gt(simulated, 0) && isFinite(simulated) ? simulated : ""
    // Safe to use as deps
    !close && setValues((values) => ({ ...values, [key]: next }))
  }, [type, simulated, reverse, setValues, open, close])

  /* render:form */
  const config1: Config = {
    value: symbol1,
    onSelect: onSelect(Key.symbol1),
    useUST: true,
    skip: [MIR],
  }

  const config2: Config = {
    value: symbol2,
    onSelect: onSelect(Key.symbol2),
    useUST: false,
    skip: [MIR],
  }

  const select1 = useSelectAsset({ priceKey, balanceKey, ...config1 })
  const select2 = useSelectAsset({ priceKey, balanceKey, ...config2 })

  const fields = {
    ...getFields({
      [Key.value1]: {
        label: "Collateral",
        input: {
          type: "number",
          step: step(symbol1),
          placeholder: placeholder(symbol1),
          autoFocus: true,
          ref: valueRef,
        },
        unit: open ? select1.button : lookupSymbol(symbol1),
        assets: select1.assets,
        help: renderBalance(max(symbol1), symbol1),
        focused: select1.isOpen,
      },

      [Key.value2]: {
        label: "Expected Minted Asset",
        input: {
          type: "number",
          step: step(symbol2),
          placeholder: placeholder(symbol2),
        },
        unit: select2.button,
        assets: select2.assets,
        help: renderBalance(max(symbol2), symbol2),
        focused: select2.isOpen,
      },

      [Key.ratio]: {
        label: "Collateral Ratio",
        input: { type: "number", step: step(), placeholder: "200" },
        unit: "%",
      },
    }),
  }

  /* render:position */
  const positionInfo = [
    {
      title: "Collateral",
      content: formatAsset(prevCollateral?.amount, prevCollateral?.symbol),
    },
    {
      title: "Asset",
      content: formatAsset(prevAsset?.amount, prevAsset?.symbol),
    },
  ]

  /* render:ratio */
  const minRatio = symbol2
    ? find(AssetInfoKey.MINCOLLATERALRATIO, symbol2)
    : "1.5"

  const safeRatio = plus(minRatio, 0.5)
  const nextRatio = div(ratio, 100)

  const ratioProps = {
    min: minRatio,
    safe: safeRatio,
    next: nextRatio,
    prev: prevRatio,
    onClick: (ratio: string) => {
      form.setChanged(Key.ratio)
      setValue(Key.ratio, floor(times(ratio, 100)))
    },
  }

  /* confirm */
  const price =
    type === Type.OPEN
      ? gt(amount2, 0)
        ? div(amount1, amount2)
        : "0"
      : div(nextCollateralAmount, prevAsset?.amount)

  const priceContent = (
    <Count
      format={(value) => `1 ${lookupSymbol(symbol2)} ≈ ${format(value)}`}
      symbol={symbol1}
    >
      {price}
    </Count>
  )

  const collateralContents = [
    {
      title: "Total collateral",
      content: <Count symbol={symbol1}>{nextCollateralAmount}</Count>,
    },
    {
      title: "Price",
      content: priceContent,
    },
  ]

  const contents = {
    [Type.OPEN]: [
      {
        title: "Price",
        content: priceContent,
      },
    ],

    [Type.CLOSE]: [
      {
        title: "Burn Amount",
        content: <Count symbol={prevAsset?.symbol}>{prevAsset?.amount}</Count>,
      },
      {
        title: "Withdraw Amount",
        content: (
          <Count symbol={prevCollateral?.symbol}>
            {prevCollateral?.amount}
          </Count>
        ),
      },
    ],

    [Type.DEPOSIT]: collateralContents,
    [Type.WITHDRAW]: collateralContents,
  }[type]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const collateral = toToken({ amount: amount1, symbol: symbol1 })
  const { token: token1 } = getListedItem(symbol1)
  const { token: token2 } = getListedItem(symbol2)
  const isCollateralUST = symbol1 === UUSD

  const { mint } = contracts
  const createSend = (msg: object, amount?: string) => ({
    send: { amount, contract: mint, msg: toBase64(msg) },
  })

  const openPosition = {
    open_position: {
      collateral,
      collateral_ratio: div(ratio, 100),
      asset_info: toAssetInfo(token2),
    },
  }

  const deposit = {
    deposit: { position_idx: position?.idx, collateral },
  }

  const withdraw = {
    withdraw: { position_idx: position?.idx, collateral },
  }

  const burn = {
    burn: { position_idx: position?.idx },
  }

  const data = {
    [Type.OPEN]: [
      isCollateralUST
        ? newContractMsg(mint, openPosition, { amount: amount1, denom: UUSD })
        : newContractMsg(token1, createSend(openPosition, amount1)),
    ],
    [Type.CLOSE]: [
      newContractMsg(token2, createSend(burn, prevAsset?.amount)),
      newContractMsg(mint, withdraw),
    ],
    [Type.DEPOSIT]: [
      isCollateralUST
        ? newContractMsg(mint, deposit, { amount: amount1, denom: UUSD })
        : newContractMsg(token1, createSend(deposit, amount1)),
    ],
    [Type.WITHDRAW]: [newContractMsg(mint, withdraw)],
  }[type]

  const disabled = !close && invalid
  const label = open ? MenuKey.MINT : type
  const messages = !touched[Key.ratio]
    ? undefined
    : errors[Key.ratio]
    ? [errors[Key.ratio]]
    : lt(nextRatio, safeRatio)
    ? ["Entered collateral ratio is lower than safe ratio"]
    : undefined

  const container = { contents, data, disabled, messages, attrs, tab, label }

  return type === Type.CLOSE ? (
    <FormContainer {...container} pretax={uusd} parserKey="mint" />
  ) : (
    <FormContainer {...container} pretax={uusd} parserKey="mint">
      {position && (
        <Dl list={positionInfo} className={styles.dl} align="center" />
      )}

      <FormGroup {...fields[Key.value1]} />
      {open && <FormIcon name="arrow_downward" />}
      {open && <FormGroup {...fields[Key.value2]} />}
      <FormGroup {...fields[Key.ratio]} skipFeedback />
      <CollateralRatio {...ratioProps} />
    </FormContainer>
  )
}

export default MintForm
