import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, MIR } from "../constants"
import { gt } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import { Type } from "../pages/Stake"
import useStakeReceipt from "./receipts/useStakeReceipt"
import { toBase64 } from "../libs/formHelpers"
import FormContainer from "./FormContainer"

enum Key {
  value = "value",
}

interface Props {
  type: Type
  token: string
  tab: Tab
  /** Gov stake */
  gov?: boolean
}

const StakeForm = ({ type, token, tab, gov }: Props) => {
  const balanceKey = (!gov
    ? {
        [Type.STAKE]: BalanceKey.LPSTAKABLE,
        [Type.UNSTAKE]: BalanceKey.LPSTAKED,
      }
    : {
        [Type.STAKE]: BalanceKey.TOKEN,
        [Type.UNSTAKE]: BalanceKey.MIRGOVSTAKED,
      })[type as Type]

  /* context */
  const { contracts, whitelist, getSymbol } = useContractsAddress()
  const { find, parsed } = useContract()
  useRefetch([balanceKey, !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED])

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const max = find(balanceKey, token)
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* render:form */
  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      help: renderBalance(find(balanceKey, token), symbol),
      unit: gov ? MIR : LP,
      max: gt(find(balanceKey, token), 0)
        ? () => setValue(Key.value, lookup(find(balanceKey, token), symbol))
        : undefined,
    },
  })

  /* confirm */
  const staked = find(
    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
    token
  )

  const contents = !value
    ? undefined
    : gt(staked, 0)
    ? [{ title: "Staked", content: formatAsset(staked, getLpName(symbol)) }]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { lpToken } = whitelist[token] ?? {}
  const assetToken = { asset_token: token }
  const data = {
    [Type.STAKE]: [
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
    [Type.UNSTAKE]: [
      gov
        ? newContractMsg(contracts["gov"], {
            withdraw_voting_tokens: { amount },
          })
        : newContractMsg(contracts["staking"], {
            unbond: { ...assetToken, amount },
          }),
    ],
  }[type as Type]

  const locked = parsed[BalanceKey.MIRGOVSTAKED]?.locked_share.length
  const messages =
    gov && type === Type.UNSTAKE && locked
      ? ["MIR are voted in polls"]
      : undefined

  const disabled = invalid || !!messages?.length

  /* result */
  const parseTx = useStakeReceipt()

  const container = { tab, attrs, contents, messages, disabled, data, parseTx }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value]} />
    </FormContainer>
  )
}

export default StakeForm
