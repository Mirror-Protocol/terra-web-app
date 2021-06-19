import { useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"

import useNewContractMsg from "../libs/useNewContractMsg"
import Tooltips from "../lang/Tooltips"
import { DEFAULT_SLIPPAGE } from "../constants"
import { gt } from "../libs/math"
import { format, lookup, toAmount } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { usePolling } from "../hooks"
import { PriceKey, BalanceKey, StakingKey } from "../hooks/contractKeys"
import { tokenBalanceQuery } from "../data/contract/contract"
import { useProtocol } from "../data/contract/protocol"
import { useFind, useFindStaking } from "../data/contract/normalize"

import { getPath, MenuKey } from "../routes"
import FormGroup from "../components/FormGroup"
import Formatted from "../components/Formatted"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import { MintType, PoolType, TradeType } from "../types/Types"
import usePoolReceipt from "./receipts/usePoolReceipt"
import useSelectAsset from "./useSelectAsset"
import usePool from "./usePool"
import FormContainer from "./FormContainer"
import FormIcon from "./FormIcon"
import styles from "./PoolForm.module.scss"

interface Props {
  type: PoolType
}

enum Key {
  token = "token",
  value = "value",
}

const PoolForm = ({ type }: Props) => {
  useRecoilValue(tokenBalanceQuery) // To determine to show "Buy or Borrow"
  const priceKey = PriceKey.PAIR

  /* context */
  const { state, search } = useLocation<{ token: string }>()
  const sp = new URLSearchParams(search)
  const autoStake = sp.get("pool") === null
  const { contracts, whitelist, getSymbol, toToken } = useProtocol()
  const find = useFind()
  const findStaking = useFindStaking()
  usePolling()

  const getBalance = (token: string) =>
    ({
      [PoolType.PROVIDE]: find(BalanceKey.TOKEN, token),
      [PoolType.WITHDRAW]: findStaking(StakingKey.LPSTAKABLE, token),
    }[type])

  /* form:validate */
  const validate = ({ value, token }: Values<Key>) => {
    const max = getBalance(token)
    const symbol = getSymbol(token)

    return {
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.token]: v.required(token),
    }
  }

  /* form:hook */
  const initial = { [Key.value]: "", [Key.token]: state?.token ?? "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value, token } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)
  const pairPrice = find(priceKey, token)
  const oraclePrice = find(PriceKey.ORACLE, token)
  const price = gt(pairPrice, 0) ? pairPrice : oraclePrice

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>(null)
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value && valueRef.current?.focus()
  }

  /* estimate:uusd */
  const balance = getBalance(token)
  const { pair, lpToken } = whitelist[token] ?? {}

  /* estimate:result */
  const getPool = usePool()
  const pool = token ? getPool({ amount, token }) : undefined
  const toLP = pool?.toLP
  const fromLP = pool?.fromLP
  const estimated = pool?.toLP.estimated

  const uusd = {
    [PoolType.PROVIDE]: estimated,
    [PoolType.WITHDRAW]: fromLP?.uusd.amount,
  }[type]

  /* render:form */
  const config = {
    token,
    onSelect,
    priceKey,
    balanceKey: type === PoolType.PROVIDE ? BalanceKey.TOKEN : undefined,
    formatTokenName: type === PoolType.WITHDRAW ? getLpName : undefined,
    showDelisted: type === PoolType.WITHDRAW,
  }

  const select = useSelectAsset(config)
  const delisted = whitelist[token]?.["status"] === "DELISTED"

  const toBuy = {
    pathname: getPath(MenuKey.TRADE),
    hash: TradeType.BUY,
    state: { token },
  }

  const linkToBuy = (
    <Link className={styles.link} to={toBuy}>
      Buy
    </Link>
  )

  const toBorrow = {
    pathname: getPath(MenuKey.BORROW),
    hash: MintType.BORROW,
    state: { token },
  }

  const linkToBorrow = (
    <Link className={styles.link} to={toBorrow}>
      Borrow
    </Link>
  )

  const info = gt(balance, 0) ? undefined : (
    <p>
      {linkToBuy}
      {symbol !== "MIR" && <> or {linkToBorrow}</>} {symbol} to farm with
    </p>
  )

  const fields = {
    ...getFields({
      [Key.value]: {
        label: {
          [PoolType.PROVIDE]: (
            <TooltipIcon content={Tooltips.Farm.InputAsset}>
              Provide
            </TooltipIcon>
          ),
          [PoolType.WITHDRAW]: "LP",
        }[type],
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          ref: valueRef,
        },
        unit: delisted ? symbol : select.button,
        max: gt(balance, 0)
          ? () => setValue(Key.value, lookup(balance, symbol))
          : undefined,
        assets: select.assets,
        help: renderBalance(balance, symbol),
        focused: type === PoolType.WITHDRAW && select.isOpen,
        info,
      },
    }),

    estimated: {
      [PoolType.PROVIDE]: {
        label: <TooltipIcon content={Tooltips.Farm.InputUST}>and</TooltipIcon>,
        value: toLP?.text,
        help: renderBalance(find(BalanceKey.NATIVE, "uusd"), "uusd"),
        unit: "UST",
        unitAfterValue: true,
      },
      [PoolType.WITHDRAW]: {
        label: (
          <TooltipIcon content={Tooltips.Farm.Output}>Received</TooltipIcon>
        ),
        value: fromLP?.text,
      },
    }[type],
  }

  const icons = {
    [PoolType.PROVIDE]: <FormIcon name="Plus" />,
    [PoolType.WITHDRAW]: <FormIcon name="ArrowDown" />,
  }

  /* confirm */
  const contents = !gt(price, 0)
    ? undefined
    : [
        {
          title: (
            <TooltipIcon content={Tooltips.Farm.PoolPrice}>
              {gt(pairPrice, 0) ? "Terraswap" : "Oracle"} Price
            </TooltipIcon>
          ),
          content: (
            <Formatted format={format} symbol="uusd">
              {price}
            </Formatted>
          ),
        },
      ]

  /* submit */
  const newContractMsg = useNewContractMsg()

  const provideMsg = Object.assign(
    {},
    estimated && {
      assets: [
        toToken({ amount, token }),
        toToken({ amount: estimated, token: "uusd" }),
      ],
    },
    gt(pairPrice, 0) && {
      slippage_tolerance: String(DEFAULT_SLIPPAGE),
    }
  )

  const data = {
    [PoolType.PROVIDE]: estimated
      ? [
          newContractMsg(token, {
            increase_allowance: {
              amount,
              spender: autoStake ? contracts["staking"] : pair,
            },
          }),
          newContractMsg(
            autoStake ? contracts["staking"] : pair,
            { [autoStake ? "auto_stake" : "provide_liquidity"]: provideMsg },
            { amount: estimated, denom: "uusd" }
          ),
        ]
      : [],
    [PoolType.WITHDRAW]: [
      newContractMsg(lpToken, {
        send: {
          amount,
          contract: pair,
          msg: toBase64({ withdraw_liquidity: {} }),
        },
      }),
    ],
  }[type]

  const insufficient =
    !!estimated && gt(estimated, find(BalanceKey.NATIVE, "uusd"))
  const disabled = invalid || (type === PoolType.PROVIDE && insufficient)

  /* result */
  const parseTx = usePoolReceipt(type)
  const label = autoStake ? undefined : "Provide liquidity"
  const container = { attrs, contents, disabled, data, parseTx, label }
  const tax = { pretax: uusd, deduct: type === PoolType.WITHDRAW }

  return (
    <WithPriceChart token={token}>
      <FormContainer {...container} {...tax}>
        <FormGroup {...fields[Key.value]} />
        {icons[type]}
        <FormGroup {...fields["estimated"]} />
      </FormContainer>
    </WithPriceChart>
  )
}

export default PoolForm
