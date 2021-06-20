import { useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { reverse } from "ramda"
import classNames from "classnames/bind"
import { MsgExecuteContract } from "@terra-money/terra.js"

import useNewContractMsg from "../libs/useNewContractMsg"
import MESSAGE from "../lang/MESSAGE.json"
import Tooltips from "../lang/Tooltips"
import { TRADING_HOURS } from "../constants"
import { plus, times, div, floor, abs, minus } from "../libs/math"
import { gt, gte, lt, isFinite } from "../libs/math"
import { percentage } from "../libs/num"
import { format, formatAsset, lookup, lookupSymbol } from "../libs/parse"
import { decimal, toAmount, getIsTokenNative } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import calc from "../libs/calc"
import { useProtocol } from "../data/contract/protocol"
import { slippageQuery } from "../data/tx/slippage"
import { BalanceKey, PriceKey } from "../hooks/contractKeys"
import useTax from "../hooks/useTax"
import { useFindBalance, useFindPrice } from "../data/contract/normalize"
import { useGetMinRatio } from "../data/contract/collateral"
import { getMintPriceKeyQuery } from "../data/contract/collateral"

import FormGroup from "../components/FormGroup"
import Formatted from "../components/Formatted"
import { TooltipIcon } from "../components/Tooltip"
import FormFeedback from "../components/FormFeedback"
import ExtLink from "../components/ExtLink"
import Icon from "../components/Icon"
import WithPriceChart from "../containers/WithPriceChart"
import { MintType, TradeType } from "../types/Types"
import { getPath, MenuKey } from "../routes"
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
}

/*
(required)
minimum collateral ratio & multiplier: collateral ratio on form & component
price: collateral ratio of the position
token balance: validate balance on close
*/

const MintForm = ({ position, type }: Props) => {
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { contracts, listed, ...helpers } = useProtocol()
  const { getSymbol, getIsDelisted, parseToken, toToken, toAssetInfo } = helpers

  const getPriceKey = useRecoilValue(getMintPriceKeyQuery)
  const getMinRatio = useGetMinRatio()
  const findPrice = useFindPrice()
  const findBalance = useFindBalance()

  const { getMax: getMaxAmount } = useTax()
  const { isClosed } = useLatest()

  const getSafeRatio = (ratio: string) =>
    gt(ratio, 0) ? plus(ratio, 0.5) : "0"

  const getRatio = (collateral: Asset, asset: Asset) => {
    const getPrice = (token: string) => findPrice(getPriceKey(token), token)

    const { ratio } = calc.mint({
      collateral: {
        amount: collateral.amount,
        price: getPrice(collateral.token),
      },
      asset: {
        amount: asset.amount,
        price: getPrice(asset.token),
      },
    })

    return ratio
  }

  /* context:position */
  const open = !position
  const short = type === MintType.SHORT || position?.is_short
  const edit = type === MintType.EDIT
  const close = type === MintType.CLOSE

  /* form:validate */
  const validate = ({ token1, token2, value1, value2, ratio }: Values<Key>) => {
    const symbol1 = getSymbol(token1)
    const nextRatio = div(ratio, 100)

    return {
      [Key.value1]: v.amount(value1, {
        symbol: symbol1,
        max: edit
          ? plus(prevCollateral?.amount, findBalance(token1))
          : findBalance(token1),
      }),
      [Key.value2]: "",
      [Key.token1]: v.required(token1),
      [Key.token2]: v.required(token2),
      [Key.ratio]: !gte(nextRatio, getMinRatio(token1, token2))
        ? MESSAGE.Form.Validate.CollateralRatio.Minimum
        : v.required(ratio),
    }
  }

  /* form:hook */
  const prevCollateral = position && parseToken(position.collateral)
  const prevAsset = position && parseToken(position.asset)

  const prevRatio =
    prevCollateral && prevAsset && getRatio(prevCollateral, prevAsset)

  const initialToken =
    state?.token ?? listed.find(({ symbol }) => symbol !== "MIR")?.token

  const initialRatio = getSafeRatio(getMinRatio("uusd", initialToken))

  const initial = {
    [Key.value1]: prevCollateral
      ? lookup(prevCollateral.amount, prevCollateral.token)
      : "",
    [Key.value2]: prevAsset ? lookup(prevAsset.amount, prevAsset.token) : "",
    [Key.token1]: prevCollateral?.token ?? "uusd",
    [Key.token2]: prevAsset?.token ?? initialToken,
    [Key.ratio]: position
      ? prevRatio
        ? times(prevRatio, 100)
        : ""
      : gt(initialRatio, "0")
      ? times(initialRatio, 100)
      : "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields } = form
  const { touched, errors, attrs, invalid, changed } = form
  const { token1, token2, value1, value2, ratio } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)
  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null)
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
  const price1 = findPrice(priceKey1, token1)
  const price2 = findPrice(priceKey2, token2)

  const updateKey = edit
    ? changed !== Key.ratio
      ? Key.ratio
      : Key.value1
    : changed !== Key.value2
    ? Key.value2
    : Key.value1

  const calculated = calc.mint({
    collateral: {
      amount: updateKey === Key.value1 ? undefined : amount1,
      price: price1,
    },
    asset: {
      amount: updateKey === Key.value2 ? undefined : amount2,
      price: price2,
    },
    ratio: updateKey === Key.ratio ? undefined : div(ratio, 100),
  })

  const simulated = {
    [Key.value1]: lookup(calculated.collateral.amount, symbol1),
    [Key.value2]: lookup(calculated.asset.amount, symbol2),
    [Key.ratio]: lookup(times(calculated.ratio, 100)),
  }[updateKey]

  useEffect(() => {
    if (!close && gt(simulated, 0) && isFinite(simulated))
      setValues((values) => ({ ...values, [updateKey]: simulated }))
  }, [updateKey, simulated, setValues, close])

  useEffect(() => {
    // Init after lazy loading (price)
    if (prevRatio) {
      const ratio = times(decimal(prevRatio, 4), 100)
      setValues((values) => ({ ...values, [Key.ratio]: ratio }))
    }
  }, [prevRatio, setValues])

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

  const maxAmountOpen =
    symbol1 === "uusd"
      ? lookup(getMaxAmount(findBalance(token1)), "uusd")
      : lookup(findBalance(token1), symbol1)

  const maxAmount = edit
    ? plus(lookup(prevCollateral?.amount, symbol1), maxAmountOpen)
    : maxAmountOpen

  /* latest price */
  const isMarketClosed1 = getIsDelisted(token1) ? false : isClosed(symbol1)
  const isMarketClosed2 = getIsDelisted(token2) ? false : isClosed(symbol2)
  const isMarketClosed = isMarketClosed1 || isMarketClosed2

  const marketHoursLink = (
    <ExtLink href={TRADING_HOURS} className={styles.link}>
      market hours
    </ExtLink>
  )

  const marketClosedMessage = (
    <p className={styles.message}>
      Only available during {marketHoursLink}
      <Icon name="External" size={14} />
    </p>
  )

  const toBuy = {
    pathname: getPath(MenuKey.TRADE),
    hash: TradeType.BUY,
    state: { token: token2 },
  }

  const linkToBuy = (
    <Link className={styles.link} to={toBuy}>
      Buy {symbol2}
    </Link>
  )

  const diffCollateral = minus(amount1, prevCollateral?.amount)
  const diffAsset = minus(amount2, prevAsset?.amount)
  const invalidRepay = edit && gt(times(diffAsset, -1), findBalance(token2))

  const fields = getFields({
    [Key.value1]: {
      label: open ? (
        "Collateralize"
      ) : (
        <TooltipIcon content={Tooltips.Mint.Collateral}>Collateral</TooltipIcon>
      ),
      prev: edit ? format(prevCollateral?.amount, symbol1) : undefined,
      input: {
        type: "number",
        step: step(symbol1),
        placeholder: placeholder(symbol1),
        autoFocus: true,
        ref: valueRef,
      },
      unit: open ? select1.button : symbol1,
      max: gt(maxAmount, 0) ? () => setValue(Key.value1, maxAmount) : undefined,
      assets: select1.assets,
      help: renderBalance(findBalance(token1), symbol1),
      focused: select1.isOpen,
    },

    [Key.value2]: {
      label: edit ? (
        short ? (
          "Shorted"
        ) : (
          <TooltipIcon content={Tooltips.Mint.Asset}>Borrowed</TooltipIcon>
        )
      ) : short ? (
        <TooltipIcon content={Tooltips.Farm.Shorted}>to short</TooltipIcon>
      ) : (
        <TooltipIcon content={Tooltips.Mint.ExpectedMintedAsset}>
          to borrow
        </TooltipIcon>
      ),
      prev: edit ? format(prevAsset?.amount, symbol2) : undefined,
      input: {
        type: "number",
        step: step(symbol2),
        placeholder: placeholder(symbol2),
      },
      unit: open ? select2.button : symbol2,
      assets: select2.assets,
      help: renderBalance(findBalance(token2), symbol2),
      focused: select2.isOpen,
      warn: invalidRepay ? (
        <>{linkToBuy} to repay</>
      ) : isMarketClosed ? (
        marketClosedMessage
      ) : undefined,
    },

    [Key.ratio]: {
      label: open ? (
        <TooltipIcon content={Tooltips.Mint.CollateralRatio}>
          at collateral ratio
        </TooltipIcon>
      ) : (
        "Collateral Ratio (%)"
      ),
      prev: edit ? (prevRatio ? percentage(prevRatio) : "0") : undefined,
      input: { type: "number", step: step(), placeholder: "" },
      unit: open ? "%" : "",
    },
  })

  /* render:ratio */
  const minRatio = getMinRatio(token1, token2)
  const safeRatio = getSafeRatio(minRatio)
  const nextRatio = div(ratio, 100)

  // Init the collateral ratio based on the minimum collateral ratio
  useEffect(() => {
    if (open && gt(safeRatio, 0))
      setValues((values) => ({ ...values, [Key.ratio]: times(safeRatio, 100) }))
  }, [safeRatio, setValues, open])

  const ratioProps = {
    min: minRatio,
    safe: safeRatio,
    ratio: nextRatio,
    onRatio: (ratio: string) => {
      form.setChanged(Key.ratio)
      setValue(Key.ratio, floor(times(ratio, 100)))
    },
  }

  /* confirm */
  const price = div(findPrice(priceKey2, token2), findPrice(priceKey1, token1))

  const priceContents = {
    title: <TooltipIcon content={Tooltips.Mint.Price}>Price</TooltipIcon>,
    content: (
      <Formatted
        format={(value) => `1 ${lookupSymbol(symbol2)} ≈ ${format(value)}`}
        symbol={symbol1}
      >
        {price}
      </Formatted>
    ),
  }

  const uusdContents = {
    title: (
      <TooltipIcon content={Tooltips.Mint.ExpectedUST}>
        Expected locked UST
      </TooltipIcon>
    ),
    content: (
      <Formatted symbol="uusd">
        {times(amount2, findPrice(PriceKey.PAIR, token2))}
      </Formatted>
    ),
  }

  const burnContents = {
    title: "Burn Amount",
    content: <Formatted symbol={symbol2}>{prevAsset?.amount}</Formatted>,
  }

  const withdrawContents = {
    title: "Withdraw Amount",
    content: <Formatted symbol={symbol1}>{prevCollateral?.amount}</Formatted>,
  }

  const PROTOCOL_FEE = 0.015
  const protocolFee = times(times(price, amount2), PROTOCOL_FEE)
  const protocolFeeContents = {
    title: "Protocol Fee",
    content: <Formatted symbol={symbol1}>{protocolFee}</Formatted>,
  }

  const formatWithSign = (amount: string, symbol: string) => {
    const sign = gt(amount, 0) ? "+" : lt(amount, 0) ? "-" : ""
    return sign + formatAsset(abs(amount), symbol)
  }

  const collateralContents = {
    title: "Collateral",
    content: formatWithSign(diffCollateral, symbol1),
  }

  const mintedContents = {
    title: short ? "Shorted" : "Borrowed",
    content: formatWithSign(diffAsset, symbol2),
  }

  const closeDelistedAsset =
    prevAsset && getIsDelisted(prevAsset.token) && gt(prevAsset.amount, 0)

  const contents = {
    [MintType.BORROW]: !gt(price, 0) ? undefined : [priceContents],
    [MintType.SHORT]: !gt(price, 0) ? undefined : [priceContents, uusdContents],

    [MintType.CLOSE]: closeDelistedAsset
      ? [burnContents]
      : [burnContents, withdrawContents, protocolFeeContents],

    [MintType.EDIT]: [priceContents, collateralContents, mintedContents],
  }[type]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const collateral = toToken({
    amount: edit ? abs(diffCollateral) : amount1,
    token: token1,
  })

  const asset = toToken({
    amount: edit ? abs(diffAsset) : amount2,
    token: token2,
  })

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

  const editData = [
    lt(diffAsset, 0)
      ? newContractMsg(token2, createSend(burn, abs(diffAsset)))
      : gt(diffAsset, 0)
      ? newContractMsg(contracts["mint"], mint)
      : undefined,
    lt(diffCollateral, 0)
      ? newContractMsg(contracts["mint"], withdraw)
      : gt(diffCollateral, 0)
      ? isCollateralNative
        ? newContractMsg(contracts["mint"], deposit, {
            amount: diffCollateral,
            denom: token1,
          })
        : newContractMsg(token1, createSend(deposit, diffCollateral))
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
    [MintType.EDIT]: gt(diffCollateral, 0) ? reverse(editData) : editData,
  }[type]?.filter(Boolean) as MsgExecuteContract[]

  const ratioMessages = errors[Key.ratio]
    ? [errors[Key.ratio]]
    : lt(nextRatio, safeRatio)
    ? [MESSAGE.Form.Validate.CollateralRatio.Safe]
    : undefined

  const closeMessages =
    prevAsset && !gte(findBalance(token2), prevAsset.amount)
      ? [<>{linkToBuy} to close position</>]
      : undefined

  const messages = touched[Key.ratio]
    ? ratioMessages
    : close
    ? closeMessages
    : undefined

  const disabled =
    isMarketClosed || invalidRepay || (!close ? invalid : !!closeMessages)

  const label = type

  /* result */
  const parseTx = useMintReceipt(type, position)

  const container = { attrs, contents, messages, label, disabled, data }
  const deduct = close || (edit && lt(diffCollateral, 0))
  const tax = {
    pretax: token1 === "uusd" ? (edit ? diffCollateral : amount1) : "0",
    deduct,
  }

  return (
    <WithPriceChart token={token2}>
      {type === MintType.CLOSE ? (
        <FormContainer {...container} {...tax} parseTx={parseTx} />
      ) : type === MintType.EDIT ? (
        <FormContainer {...container} {...tax} parseTx={parseTx}>
          <FormGroup {...fields[Key.value1]} type={3} size="xs" />
          <FormGroup {...fields[Key.ratio]} type={3} size="xs" skipFeedback />
          <FormGroup {...fields[Key.value2]} type={3} size="xs" />
          <section className={styles.ratio}>
            <CollateralRatio {...ratioProps} />
          </section>
          <FormFeedback type="warn">{Tooltips.Mint.Caution}</FormFeedback>
        </FormContainer>
      ) : (
        <FormContainer {...container} {...tax} parseTx={parseTx}>
          {short && (
            <section className={cx(styles.header, { right: short })}>
              <SetSlippageTolerance />
            </section>
          )}

          <FormGroup {...fields[Key.value1]} />
          <FormGroup {...fields[Key.ratio]} skipFeedback />
          <FormIcon name="ArrowDown" />
          <FormGroup {...fields[Key.value2]} />

          <section className={styles.ratio}>
            <CollateralRatio {...ratioProps} />
          </section>

          <FormFeedback type="warn">{Tooltips.Mint.Caution}</FormFeedback>
        </FormContainer>
      )}
    </WithPriceChart>
  )
}

export default MintForm
