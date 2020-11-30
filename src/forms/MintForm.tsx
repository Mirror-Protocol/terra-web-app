import { useEffect, useRef } from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { MIR, UUSD } from "../constants"
import { plus, minus, times, div, floor, max } from "../libs/math"
import { gt, gte, lt, isFinite } from "../libs/math"
import { capitalize } from "../libs/utils"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import calc from "../helpers/calc"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import { BalanceKey, AccountInfoKey } from "../hooks/contractKeys"
import { MenuKey } from "../routes"

import FormGroup from "../components/FormGroup"
import Dl from "../components/Dl"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
import { Type } from "../pages/Mint"
import useMintReceipt from "./receipts/useMintReceipt"
import FormContainer from "./FormContainer"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormIcon from "./FormIcon"
import CollateralRatio from "./CollateralRatio"
import styles from "./MintForm.module.scss"

enum Key {
  value1 = "value1",
  value2 = "value2",
  token1 = "token1",
  token2 = "token2",
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
  const { contracts, ...helpers } = useContractsAddress()
  const { getSymbol, parseToken, toToken, toAssetInfo } = helpers
  const { find } = useContract()
  const { loading } = useRefetch([priceKey, balanceKey])

  /* context:position */
  const { [AccountInfoKey.MINTPOSITIONS]: positions } = useContract()
  const position = positions?.find((position) => position.idx === idx)
  const open = !position
  const close = type === Type.CLOSE

  /* form:validate */
  const getMax = (token: string) =>
    type === Type.WITHDRAW ? prevCollateral?.amount : find(balanceKey, token)

  const validate = ({ token1, token2, value1, ratio }: Values<Key>) => {
    const symbol1 = getSymbol(token1)
    const nextRatio = div(ratio, 100)

    return {
      [Key.value1]: v.amount(value1, { symbol: symbol1, max: getMax(token1) }),
      [Key.value2]: "",
      [Key.token1]: v.required(token1),
      [Key.token2]: open ? v.required(token2) : "",
      [Key.ratio]:
        prevRatio && !(type === Type.DEPOSIT ? gt : lt)(nextRatio, prevRatio)
          ? MESSAGE.Form.Validate.CollateralRatio.Current
          : !gte(nextRatio, find(AssetInfoKey.MINCOLLATERALRATIO, token2))
          ? MESSAGE.Form.Validate.CollateralRatio.Minimum
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
        price: find(priceKey, prevCollateral.token),
      },
      asset: {
        amount: prevAsset.amount,
        price: find(priceKey, prevAsset.token),
      },
    }

  const prevRatio = params && calc.mint(params).ratio

  const initial = {
    [Key.value1]:
      (close && lookup(prevCollateral?.amount, prevCollateral?.token)) || "",
    [Key.value2]: "",
    [Key.token1]: prevCollateral?.token ?? UUSD,
    [Key.token2]: prevAsset?.token ?? "",
    [Key.ratio]: prevRatio ? lookup(times(prevRatio, 100)) : "200",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields } = form
  const { touched, errors, attrs, invalid } = form
  const { token1, token2, value1, value2, ratio } = values
  const amount1 = toAmount(value1)
  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)
  const uusd = token1 === UUSD ? amount1 : "0"

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null!)
  const onSelect = (name: Key) => (token: string) => {
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.token1]: { token2: token === token2 ? "" : token2 },
      [Key.token2]: { token1: token === token1 ? "" : token1 },
    }

    setValues({ ...values, ...next[name], [name]: token })
    !value1 && valueRef.current.focus()
  }

  /* simulation */
  const price1 = find(priceKey, token1)
  const price2 = find(priceKey, token2)
  const reverse = form.changed !== Key.value1
  const nextCollateralAmount = max([
    (type === Type.DEPOSIT ? plus : minus)(prevCollateral?.amount, amount1),
    "0",
  ])

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
    token: token1,
    onSelect: onSelect(Key.token1),
    useUST: true,
    skip: [MIR],
  }

  const config2: Config = {
    token: token2,
    onSelect: onSelect(Key.token2),
    useUST: false,
    skip: [MIR],
  }

  const select1 = useSelectAsset({ priceKey, balanceKey, ...config1 })
  const select2 = useSelectAsset({ priceKey, balanceKey, ...config2 })

  const fields = {
    ...getFields({
      [Key.value1]: {
        label: open ? "Collateral" : capitalize(type),
        input: {
          type: "number",
          step: step(symbol1),
          placeholder: placeholder(symbol1),
          autoFocus: true,
          ref: valueRef,
        },
        unit: open ? select1.button : lookupSymbol(symbol1),
        assets: select1.assets,
        help: renderBalance(getMax(token1), symbol1),
        focused: select1.isOpen,
      },

      [Key.value2]: {
        label: (
          <TooltipIcon content={Tooltip.Mint.ExpectedMintedAsset}>
            Minted
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(symbol2),
          placeholder: placeholder(symbol2),
        },
        unit: select2.button,
        assets: select2.assets,
        help: renderBalance(getMax(token2), symbol2),
        focused: select2.isOpen,
      },

      [Key.ratio]: {
        label: (
          <TooltipIcon content={Tooltip.Mint.CollateralRatio}>
            Collateral Ratio
          </TooltipIcon>
        ),
        input: { type: "number", step: step(), placeholder: "200" },
        unit: "%",
      },
    }),
  }

  /* render:position */
  const positionInfo = [
    {
      title: "Collateral",
      content: (
        <TooltipIcon content={Tooltip.Mint.Collateral}>
          {formatAsset(prevCollateral?.amount, prevCollateral?.symbol)}
        </TooltipIcon>
      ),
    },
    {
      title: "Minted",
      content: (
        <TooltipIcon content={Tooltip.Mint.Asset}>
          {formatAsset(prevAsset?.amount, prevAsset?.symbol)}
        </TooltipIcon>
      ),
    },
  ]

  /* render:ratio */
  const minRatio = token2
    ? find(AssetInfoKey.MINCOLLATERALRATIO, token2)
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
  const price = div(find(priceKey, token2), find(priceKey, token1))

  const priceContents = {
    title: <TooltipIcon content={Tooltip.Mint.Price}>Price</TooltipIcon>,
    content: (
      <Count
        format={(value) => `1 ${lookupSymbol(symbol2)} ≈ ${format(value)}`}
        symbol={symbol1}
      >
        {price}
      </Count>
    ),
  }

  const collateralContents = [
    {
      title: "Total collateral",
      content: <Count symbol={symbol1}>{nextCollateralAmount}</Count>,
    },
    priceContents,
  ]

  const contents = {
    [Type.OPEN]: !gt(price, 0) ? undefined : [priceContents],

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
  const collateral = toToken({ amount: amount1, token: token1 })
  const isCollateralUST = token1 === UUSD

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

  const ratioMessages = errors[Key.ratio]
    ? [errors[Key.ratio]]
    : lt(nextRatio, safeRatio)
    ? [MESSAGE.Form.Validate.CollateralRatio.Safe]
    : undefined

  const error =
    !loading &&
    prevAsset &&
    !gte(find(balanceKey, prevAsset?.token), prevAsset.amount)
      ? [MESSAGE.Form.Validate.InsufficientBalance]
      : undefined

  const messages = touched[Key.ratio]
    ? ratioMessages
    : close
    ? error
    : undefined

  const disabled = !close ? invalid : !!error
  const label = open ? MenuKey.MINT : type

  /* result */
  const parseTx = useMintReceipt(type, position)

  const container = { tab, attrs, contents, messages, label, disabled, data }
  const deduct = type === Type.WITHDRAW || type === Type.CLOSE
  const tax = { pretax: uusd, deduct }

  return type === Type.CLOSE ? (
    <FormContainer {...container} {...tax} parseTx={parseTx} />
  ) : (
    <FormContainer {...container} {...tax} parseTx={parseTx}>
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
