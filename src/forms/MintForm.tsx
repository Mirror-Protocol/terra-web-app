import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { reverse } from "ramda"
import classNames from "classnames/bind"
import { MsgExecuteContract } from "@terra-money/terra.js"

import useNewContractMsg from "../libs/useNewContractMsg"
import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { TRADING_HOURS } from "../constants"
import { plus, minus, times, div, floor, max, abs } from "../libs/math"
import { gt, gte, lt, isFinite } from "../libs/math"
import { capitalize } from "../libs/utils"
import { percent } from "../libs/num"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { decimal, toAmount, getIsTokenNative } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import calc from "../libs/calc"
import { useProtocol } from "../data/contract/protocol"
import { slippageQuery } from "../data/tx/slippage"
import { AssetInfoKey } from "../hooks/contractKeys"
import { BalanceKey } from "../hooks/contractKeys"
import useTax from "../hooks/useTax"
import { useFind, useFindAssetInfo } from "../data/contract/normalize"
import { getMinRatioQuery } from "../data/contract/collateral"
import { getMintPriceKeyQuery } from "../data/contract/collateral"

import FormGroup from "../components/FormGroup"
import Dl from "../components/Dl"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
import FormFeedback from "../components/FormFeedback"
import ExtLink from "../components/ExtLink"
import Icon from "../components/Icon"
import WithPriceChart from "../containers/WithPriceChart"
import { MintType } from "../types/Types"
import useMintReceipt from "./receipts/useMintReceipt"
import FormContainer from "./FormContainer"
import useSelectAsset from "./useSelectAsset"
import useLatest from "./useLatest"
import FormIcon from "./FormIcon"
import CollateralRatio from "./CollateralRatio"
import SetSlippageTolerance from "./SetSlippageTolerance"
import styles from "./MintForm.module.scss"

const cx = classNames.bind(styles)

enum Key {
  value1 = "value1",
  value2 = "value2",
  token1 = "token1",
  token2 = "token2",
  ratio = "ratio",
}

interface Props {
  position?: MintPosition
  type: MintType
  message?: string
}

const MintForm = ({ position, type, message }: Props) => {
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { contracts, listed, delist, ...helpers } = useProtocol()
  const { getSymbol, getIsDelisted, parseToken, toToken, toAssetInfo } = helpers
  const find = useFind()
  const findAssetInfo = useFindAssetInfo()
  const getPriceKey = useRecoilValue(getMintPriceKeyQuery)

  /* context:position */
  const open = !position
  const short = type === MintType.SHORT
  const close = type === MintType.CLOSE
  const custom = type === MintType.CUSTOM

  /* form:validate */
  const getMax = (token: string) =>
    type === MintType.WITHDRAW
      ? prevCollateral?.amount
      : find(balanceKey, token)

  const validate = ({ token1, token2, value1, value2, ratio }: Values<Key>) => {
    const symbol1 = getSymbol(token1)
    const symbol2 = getSymbol(token2)
    const nextRatio = div(ratio, 100)

    return {
      [Key.value1]: v.amount(value1, {
        symbol: symbol1,
        min: custom ? times(prevCollateral?.amount, -1) : undefined,
        max: getMax(token1),
      }),
      [Key.value2]: !custom
        ? ""
        : v.amount(value2, {
            symbol: symbol2,
            min: times(prevAsset?.amount, -1),
          }),
      [Key.token1]: v.required(token1),
      [Key.token2]: open ? v.required(token2) : "",
      [Key.ratio]: custom
        ? ""
        : prevRatio &&
          !(type === MintType.DEPOSIT ? gt : lt)(nextRatio, prevRatio)
        ? MESSAGE.Form.Validate.CollateralRatio.Current
        : !gte(
            nextRatio,
            findAssetInfo(AssetInfoKey.MINCOLLATERALRATIO, token2)
          )
        ? MESSAGE.Form.Validate.CollateralRatio.Minimum
        : v.required(ratio),
    }
  }

  /* form:hook */
  const prevCollateral = position && parseToken(position.collateral)
  const prevAsset = position && parseToken(position.asset)
  const prevAssetDelisted = prevAsset && delist[prevAsset.token]

  const params = prevCollateral &&
    prevAsset && {
      collateral: {
        amount: prevCollateral.amount,
        price: find(getPriceKey(prevCollateral.token), prevCollateral.token),
      },
      asset: {
        amount: prevAsset.amount,
        price: find(getPriceKey(prevAsset.token), prevAsset.token),
      },
    }

  const prevRatio = params && calc.mint(params).ratio

  const initial = {
    [Key.value1]:
      (close && lookup(prevCollateral?.amount, prevCollateral?.token)) || "",
    [Key.value2]: "",
    [Key.token1]: prevCollateral?.token ?? "uusd",
    [Key.token2]:
      prevAsset?.token ??
      state?.token ??
      listed.find(({ symbol }) => symbol !== "MIR")?.token,
    [Key.ratio]: prevRatio ? lookup(times(prevRatio, 100)) : "200",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields } = form
  const { touched, errors, attrs, invalid } = form
  const { token1, token2, value1, value2, ratio } = values
  const amount1 = close ? prevCollateral?.amount ?? "0" : toAmount(value1)
  const amount2 = toAmount(value2)
  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>()
  const onSelect = (name: Key) => (token: string) => {
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.token1]: { token2: token === token2 ? "" : token2 },
      [Key.token2]: { token1: token === token1 ? "" : token1 },
    }

    setValues({ ...values, ...next[name], [name]: token })
    !value1 && valueRef.current?.focus()
  }

  /* simulation */
  const priceKey1 = getPriceKey(token1)
  const priceKey2 = getPriceKey(token2)
  const price1 = find(priceKey1, token1)
  const price2 = find(priceKey2, token2)
  const reversed = !open
  const operate =
    type === MintType.DEPOSIT || type === MintType.CUSTOM ? plus : minus
  const nextCollateralAmount = max([
    operate(prevCollateral?.amount, amount1),
    "0",
  ])

  const nextAssetAmount = max([plus(prevAsset?.amount, amount2), "0"])

  const calculated = calc.mint({
    collateral: {
      amount: custom
        ? nextCollateralAmount
        : reversed
        ? undefined
        : open
        ? amount1
        : nextCollateralAmount,
      price: price1,
    },
    asset: {
      amount: custom
        ? nextAssetAmount
        : open
        ? toAmount(value2)
        : prevAsset?.amount,
      price: price2,
    },
    ratio: custom
      ? undefined
      : open
      ? div(ratio, 100)
      : !reversed
      ? undefined
      : div(ratio, 100),
  })

  const simulated = open
    ? !reversed
      ? lookup(calculated.asset.amount, symbol2)
      : lookup(calculated.collateral.amount, symbol1)
    : !reversed
    ? lookup(times(calculated.ratio, 100))
    : lookup(
        type === MintType.DEPOSIT
          ? minus(calculated.collateral.amount, prevCollateral?.amount)
          : minus(prevCollateral?.amount, calculated.collateral.amount),
        prevCollateral?.symbol
      )

  useEffect(() => {
    const key = reversed ? Key.value1 : open ? Key.value2 : Key.ratio
    const next = gt(simulated, 0) && isFinite(simulated) ? simulated : ""
    // Safe to use as deps
    !custom && !close && setValues((values) => ({ ...values, [key]: next }))
  }, [type, simulated, reversed, setValues, open, close, custom])

  /* render:form */
  const select1 = useSelectAsset({
    getPriceKey,
    balanceKey,
    token: token1,
    onSelect: onSelect(Key.token1),
    native: ["uusd", "uluna"],
    showExternal: true,
    validate: (item) => !("status" in item) || item.status !== "PRE_IPO",
    dim: (token) => (getIsDelisted(token) ? false : isClosed(getSymbol(token))),
  })

  const select2 = useSelectAsset({
    priceKey: priceKey2,
    balanceKey,
    token: token2,
    onSelect: onSelect(Key.token2),
    validate: ({ symbol }) => symbol !== "MIR",
    dim: (token) => (getIsDelisted(token) ? false : isClosed(getSymbol(token))),
  })

  const { getMax: getMaxAmount } = useTax()
  const maxAmount =
    symbol1 === "uusd"
      ? lookup(getMaxAmount(find(balanceKey, token1)), "uusd")
      : lookup(find(balanceKey, token1), symbol1)

  /* latest price */
  const { isClosed } = useLatest()
  const isMarketClosed1 = getIsDelisted(token1) ? false : isClosed(symbol1)
  const isMarketClosed2 = getIsDelisted(token2) ? false : isClosed(symbol2)
  const isMarketClosed = isMarketClosed1 || isMarketClosed2

  const marketClosedMessage = (
    <p className={styles.message}>
      Only available during{" "}
      <ExtLink href={TRADING_HOURS} className={styles.link}>
        market hours
      </ExtLink>
      <Icon name="External" size={14} />
    </p>
  )

  const fields = {
    ...getFields({
      [Key.value1]: {
        label: open || custom ? "Collateral" : capitalize(type),
        input: {
          type: "number",
          step: step(symbol1),
          placeholder: placeholder(symbol1),
          autoFocus: true,
          ref: valueRef,
        },
        unit: open ? select1.button : lookupSymbol(symbol1),
        max:
          gt(maxAmount, 0) && open
            ? () => setValue(Key.value1, maxAmount)
            : undefined,
        assets: select1.assets,
        help: renderBalance(getMax(token1), symbol1),
        focused: select1.isOpen,
      },

      [Key.value2]: {
        label: (
          <TooltipIcon content={Tooltip.Mint.ExpectedMintedAsset}>
            {short ? "Shorted" : "Borrowed"}
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(symbol2),
          placeholder: placeholder(symbol2),
        },
        unit: !custom ? select2.button : prevAsset?.symbol,
        assets: select2.assets,
        help: renderBalance(getMax(token2), symbol2),
        focused: select2.isOpen,
        warn: isMarketClosed ? marketClosedMessage : undefined,
      },

      [Key.ratio]: {
        label: (
          <TooltipIcon content={Tooltip.Mint.CollateralRatio}>
            Collateral Ratio
          </TooltipIcon>
        ),
        input: !custom
          ? { type: "number", step: step(), placeholder: "200" }
          : undefined,
        value: custom ? percent(calculated.ratio) : undefined,
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
      title: "Borrowed",
      content: (
        <TooltipIcon content={Tooltip.Mint.Asset}>
          {formatAsset(prevAsset?.amount, prevAsset?.symbol)}
        </TooltipIcon>
      ),
    },
  ]

  /* render:ratio */
  const getMinRatio = useRecoilValue(getMinRatioQuery)
  const minRatio = token2 ? getMinRatio(token1, token2) : "1.5"

  const safeRatio = plus(minRatio, 0.5)
  const nextRatio = div(ratio, 100)

  const ratioProps = {
    min: minRatio,
    safe: safeRatio,
    ratio: nextRatio,
    prev: prevRatio,
    onClick: (ratio: string) => {
      form.setChanged(Key.ratio)
      setValue(Key.ratio, floor(times(ratio, 100)))
    },
  }

  /* Init the collateral ratio based on the minimum collateral ratio */
  useEffect(() => {
    const ratio = times(safeRatio, 100)
    open && setValues((values) => ({ ...values, [Key.ratio]: ratio }))
  }, [safeRatio, setValues, open])

  /* confirm */
  const price = div(find(priceKey2, token2), find(priceKey1, token1))

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
    priceContents,
    {
      title: "Total collateral",
      content: <Count symbol={symbol1}>{nextCollateralAmount}</Count>,
    },
  ]

  const burnContents = {
    title: "Burn Amount",
    content: <Count symbol={prevAsset?.symbol}>{prevAsset?.amount}</Count>,
  }

  const withdrawContents = {
    title: "Withdraw Amount",
    content: (
      <Count symbol={prevCollateral?.symbol}>{prevCollateral?.amount}</Count>
    ),
  }

  // const PROTOCOL_FEE = 0.015
  // const getProtocolFee = (n = "0") => times(n, PROTOCOL_FEE)
  const closeDelistedAsset =
    prevAssetDelisted && prevAsset && gt(prevAsset.amount, 0)

  const contents = {
    [MintType.BORROW]: !gt(price, 0) ? undefined : [priceContents],
    [MintType.SHORT]: !gt(price, 0) ? undefined : [priceContents],

    [MintType.CLOSE]: closeDelistedAsset
      ? [burnContents]
      : [burnContents, withdrawContents],

    [MintType.DEPOSIT]: collateralContents,
    [MintType.WITHDRAW]: collateralContents,

    [MintType.CUSTOM]: [
      ...collateralContents,
      {
        title: "Total asset",
        content: <Count symbol={symbol2}>{nextAssetAmount}</Count>,
      },
    ],
  }[type]?.filter(Boolean) as Content[]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const collateral = toToken({ amount: abs(amount1), token: token1 })
  const asset = toToken({ amount: abs(amount2), token: token2 })
  const isCollateralNative = getIsTokenNative(token1)
  const slippage = useRecoilValue(slippageQuery)
  const belief = decimal(div(1, price), 18)

  const createSend = (msg: object, amount?: string) => ({
    send: { amount, contract: contracts["mint"], msg: toBase64(msg) },
  })

  const openPosition = {
    open_position: Object.assign(
      {
        collateral,
        collateral_ratio: div(ratio, 100),
        asset_info: toAssetInfo(token2),
      },
      short && { short_params: { belief_price: belief, max_spread: slippage } }
    ),
  }

  const deposit = {
    deposit: { position_idx: position?.idx, collateral },
  }

  const withdraw = {
    withdraw: Object.assign(
      { position_idx: position?.idx },
      !close && { collateral }
    ),
  }

  const mint = {
    mint: { position_idx: position?.idx, asset },
  }

  const burn = {
    burn: { position_idx: position?.idx },
  }

  const customData = [
    lt(amount2, 0)
      ? newContractMsg(token2, createSend(burn, abs(amount2)))
      : gt(amount2, 0)
      ? newContractMsg(contracts["mint"], mint)
      : undefined,
    lt(amount1, 0)
      ? newContractMsg(contracts["mint"], withdraw)
      : gt(amount1, 0)
      ? isCollateralNative
        ? newContractMsg(contracts["mint"], deposit, {
            amount: amount1,
            denom: token1,
          })
        : newContractMsg(token1, createSend(deposit, amount1))
      : undefined,
  ]

  const data = {
    [MintType.BORROW]: [
      isCollateralNative
        ? newContractMsg(contracts["mint"], openPosition, {
            amount: amount1,
            denom: token1,
          })
        : newContractMsg(token1, createSend(openPosition, amount1)),
    ],
    [MintType.SHORT]: [
      isCollateralNative
        ? newContractMsg(contracts["mint"], openPosition, {
            amount: amount1,
            denom: token1,
          })
        : newContractMsg(token1, createSend(openPosition, amount1)),
    ],
    [MintType.CLOSE]: [
      prevAsset && gt(prevAsset.amount, 0)
        ? newContractMsg(token2, createSend(burn, prevAsset?.amount))
        : undefined,
      closeDelistedAsset
        ? undefined
        : newContractMsg(contracts["mint"], withdraw),
    ],
    [MintType.DEPOSIT]: [
      isCollateralNative
        ? newContractMsg(contracts["mint"], deposit, {
            amount: amount1,
            denom: token1,
          })
        : newContractMsg(token1, createSend(deposit, amount1)),
    ],
    [MintType.WITHDRAW]: [newContractMsg(contracts["mint"], withdraw)],
    [MintType.CUSTOM]: gt(amount1, 0) ? reverse(customData) : customData,
  }[type]?.filter(Boolean) as MsgExecuteContract[]

  const ratioMessages = errors[Key.ratio]
    ? [errors[Key.ratio]]
    : lt(nextRatio, safeRatio)
    ? [MESSAGE.Form.Validate.CollateralRatio.Safe]
    : undefined

  const closeMessages =
    prevAsset && !gte(find(balanceKey, prevAsset?.token), prevAsset.amount)
      ? [`Insufficient ${prevAsset.symbol} balance`]
      : undefined

  const messages = touched[Key.ratio]
    ? ratioMessages
    : close
    ? closeMessages
    : undefined

  const disabled =
    !!message || isMarketClosed || (!close ? invalid : !!closeMessages)

  const label = type

  /* result */
  const parseTx = useMintReceipt(type, position)

  const container = { attrs, contents, messages, label, disabled, data }
  const deduct =
    type === MintType.WITHDRAW || close || (custom && lt(amount1, 0))
  const tax = { pretax: token1 === "uusd" ? amount1 : "0", deduct }

  return (
    <WithPriceChart token={token2}>
      {type === MintType.CLOSE ? (
        <FormContainer {...container} {...tax} parseTx={parseTx} />
      ) : (
        <FormContainer {...container} {...tax} parseTx={parseTx}>
          {(short || position) && (
            <section className={cx(styles.header, { right: short })}>
              {short ? (
                <SetSlippageTolerance />
              ) : (
                position && <Dl list={positionInfo} />
              )}
            </section>
          )}

          <FormGroup {...fields[Key.value1]} />
          <FormGroup {...fields[Key.ratio]} skipFeedback />
          {open && <FormIcon name="ArrowDown" />}
          {(open || custom) && <FormGroup {...fields[Key.value2]} />}

          <section className={styles.ratio}>
            {!custom && <CollateralRatio {...ratioProps} />}
          </section>

          {open && (
            <FormFeedback type="warn">{Tooltip.Mint.Caution}</FormFeedback>
          )}
        </FormContainer>
      )}
    </WithPriceChart>
  )
}

export default MintForm
