import { useLocation } from "react-router-dom"
import Tooltips from "../lang/Tooltips"
import { toBase64 } from "../libs/formHelpers"
import useNewContractMsg from "../libs/useNewContractMsg"
import { gt, minus, max as findMax, plus } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm, { Values } from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { useProtocol } from "../data/contract/protocol"
import { StakingKey } from "../hooks/contractKeys"
import { useGovStaker } from "../data/contract/contract"
import { useFindBalance, useFindStaking } from "../data/contract/normalize"
import { useGovStaked } from "../data/contract/normalize"

import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import { StakeType } from "../types/Types"
import useStakeReceipt from "./receipts/useStakeReceipt"
import usePool from "./modules/usePool"
import FormContainer from "./modules/FormContainer"
import FormIcon from "./modules/FormIcon"

enum Key {
  value = "value",
}

interface Props {
  type: StakeType
  token?: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
}

const StakeForm = ({ type, tab, gov, ...props }: Props) => {
  /* context */
  const { state } = useLocation<{ token: string }>()
  const token = props.token ?? state?.token
  const { contracts, whitelist, getSymbol } = useProtocol()
  const { contents: findBalance } = useFindBalance()
  const { contents: findStaking } = useFindStaking()
  const { contents: govStaked } = useGovStaked()
  const { contents: govStaker } = useGovStaker()
  const getPool = usePool()

  const getBalance = (token: string) =>
    (!gov
      ? {
          [StakeType.STAKE]: findStaking(StakingKey.LPSTAKABLE, token),
          [StakeType.UNSTAKE]: findStaking(StakingKey.LPSTAKED, token),
        }
      : {
          [StakeType.STAKE]: findBalance(token),
          [StakeType.UNSTAKE]: govStaked,
        })[type as StakeType]

  const getLocked = () =>
    findMax(
      govStaker?.locked_balance.map(
        ([, { balance }]: LockedBalance) => balance
      ) ?? [0]
    )

  const lockedIds = govStaker?.locked_balance
    ?.map(([id]: LockedBalance) => id)
    .join(", ")

  const getMax = () => {
    const balance = getBalance(token)
    const locked = getLocked()

    return gov && type === StakeType.UNSTAKE && gt(locked, 0)
      ? minus(balance, locked)
      : balance
  }

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max: getMax() }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* estimate */
  const pool = token ? getPool({ amount, token }) : undefined
  const fromLP = pool?.fromLP

  /* render:form */
  const max = getMax()
  const locked = getLocked()
  const fields = getFields({
    [Key.value]: {
      label: (
        <TooltipIcon content={Tooltips.Farm.UnstakeAmount}>Amount</TooltipIcon>
      ),
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      help: renderBalance(max, symbol),
      unit: gov ? "MIR" : "LP",
      max: gt(max, 0)
        ? () => setValue(Key.value, lookup(max, symbol))
        : undefined,
    },
  })

  const estimatedField = {
    label: <TooltipIcon content={Tooltips.Farm.Output}>Received</TooltipIcon>,
    value: fromLP?.text,
  }

  /* confirm */
  const staked = !gov ? findStaking(StakingKey.LPSTAKED, token) : govStaked
  const operate = { [StakeType.STAKE]: plus, [StakeType.UNSTAKE]: minus }[type]
  const afterTx = operate(staked, amount)

  const contents = !value
    ? undefined
    : gt(staked, 0)
    ? [
        {
          title: "Staked after tx",
          content: formatAsset(afterTx, !gov ? getLpName(symbol) : "MIR"),
        },
      ]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { pair, lpToken } = whitelist[token] ?? {}
  const assetToken = { asset_token: token }
  const data = {
    [StakeType.STAKE]: [
      gov
        ? newContractMsg(contracts["mirrorToken"], {
            send: {
              amount,
              contract: contracts["gov"],
              msg: toBase64({ stake_voting_tokens: {} }),
            },
          })
        : newContractMsg(lpToken, {
            send: {
              amount,
              contract: contracts["staking"],
              msg: toBase64({ bond: assetToken }),
            },
          }),
    ],
    [StakeType.UNSTAKE]: gov
      ? [
          newContractMsg(contracts["gov"], {
            withdraw_voting_tokens: { amount },
          }),
        ]
      : [
          newContractMsg(contracts["staking"], {
            unbond: { ...assetToken, amount },
          }),
          newContractMsg(lpToken, {
            send: {
              amount,
              contract: pair,
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ],
  }[type as StakeType]

  const govUnstakeMessages = gt(locked, 0)
    ? [`${formatAsset(locked, "MIR")} are voted in poll ${lockedIds}`]
    : undefined

  const messages =
    gov && type === StakeType.UNSTAKE ? govUnstakeMessages : undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt(type, !!gov)

  const container = { attrs, contents, messages, disabled, data, parseTx }

  return (
    <WithPriceChart token={token}>
      <FormContainer {...container}>
        <FormGroup {...fields[Key.value]} />

        {!gov && type === StakeType.UNSTAKE && (
          <>
            <FormIcon name="ArrowDown" />
            <FormGroup {...estimatedField} />
          </>
        )}

        {gov && type === StakeType.STAKE && (
          <FormFeedback type="help" full>
            {Tooltips.My.GovReward}
          </FormFeedback>
        )}
      </FormContainer>
    </WithPriceChart>
  )
}

export default StakeForm
