import { useRef } from "react"
import { Link, useLocation } from "react-router-dom"

import useNewContractMsg from "../libs/useNewContractMsg"
import Tooltips from "../lang/Tooltips"
import { DEFAULT_SLIPPAGE } from "../constants"
import { gt } from "../libs/math"
import { format, lookup, toAmount } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { PriceKey, BalanceKey, StakingKey } from "../hooks/contractKeys"
import { useProtocol } from "../data/contract/protocol"
import { useFindBalance, useFindPrice } from "../data/contract/normalize"
import { useFindStaking } from "../data/contract/normalize"

import { getPath, MenuKey } from "../routes"
import FormGroup from "../components/FormGroup"
import Formatted from "../components/Formatted"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import { MintType, PoolType, TradeType } from "../types/Types"
import usePoolReceipt from "./receipts/usePoolReceipt"
import useSelectAsset from "./modules/useSelectAsset"
import usePool from "./modules/usePool"
import FormContainer from "./modules/FormContainer"
import FormIcon from "./modules/FormIcon"
import Step from "./Step"
import styles from "./PoolForm.module.scss"

interface Props {
  type: PoolType
}

enum Key {
  token = "token",
  value = "value",
}

const PoolForm = ({ type }: Props) => {
  const priceKey = PriceKey.PAIR
  const provide = type === PoolType.PROVIDE
  const withdraw = type === PoolType.WITHDRAW

  /* context */
  const { state, search } = useLocation<{ token: string }>()
  const sp = new URLSearchParams(search)
  const autoStake = sp.get("pool") === null
  const { contracts, whitelist, getSymbol, toToken } = useProtocol()
  const { contents: findBalance } = useFindBalance()
  const findPrice = useFindPrice()
  const { contents: findStaking } = useFindStaking()
  const getPool = usePool()

  const getBalance = (token: string) =>
    ({
      [PoolType.PROVIDE]: findBalance(token),
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
  const pairPrice = findPrice(priceKey, token)
  const oraclePrice = findPrice(PriceKey.ORACLE, token)
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
    balanceKey: provide ? BalanceKey.TOKEN : undefined,
    formatTokenName: withdraw ? getLpName : undefined,
    showDelisted: withdraw,
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
      bought
    </Link>
  )

  const toBorrow = {
    pathname: getPath(MenuKey.BORROW),
    hash: MintType.BORROW,
    state: { token },
  }

  const linkToBorrow = (
    <Link className={styles.link} to={toBorrow}>
      borrowed
    </Link>
  )

  const info = (
    <>
      {symbol} can be {linkToBuy}
      {symbol !== "MIR" && <> or {linkToBorrow}</>}
    </>
  )

  const fields = {
    ...getFields({
      [Key.value]: {
        label: provide ? "" : "LP",
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
        focused: withdraw && select.isOpen,
      },
    }),

    estimated: {
      [PoolType.PROVIDE]: {
        label: "",
        value: toLP?.text,
        help: renderBalance(findBalance("uusd"), "uusd"),
        unit: "UST",
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

  const insufficient = !!estimated && gt(estimated, findBalance("uusd"))
  const disabled = invalid || (provide && insufficient)

  /* result */
  const parseTx = usePoolReceipt(type)
  const label = autoStake ? "Farm" : "Provide liquidity"
  const container = { attrs, contents, disabled, data, parseTx, label }
  const tax = { pretax: uusd, deduct: withdraw }

  const steps = [
    {
      index: 1,
      title: `Provide ${symbol}`,
      content: info,
      render: <FormGroup {...fields[Key.value]} type={2} />,
    },
    {
      index: 2,
      title: `Provide Additional UST`,
      content: `An equivalent UST amount must be provided.`,
      render: (
        <section className={styles.group}>
          <FormGroup {...fields["estimated"]} type={2} />
        </section>
      ),
    },
  ]

  return (
    <WithPriceChart token={token}>
      {provide ? (
        <FormContainer {...container} {...tax} full>
          {steps.map((step) => (
            <Step {...step} key={step.index} />
          ))}
        </FormContainer>
      ) : (
        <FormContainer {...container} {...tax}>
          <FormGroup {...fields[Key.value]} />
          {icons[type]}
          <FormGroup {...fields["estimated"]} />
        </FormContainer>
      )}
    </WithPriceChart>
  )
}

export default PoolForm
