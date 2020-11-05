import React from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, MIR } from "../constants"
import { gt } from "../libs/math"
import { formatAsset, toAmount } from "../libs/parse"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import { Type } from "../pages/Stake"
import getLpName from "../pages/Stake/getLpName"
import useStakeReceipt from "./receipts/useStakeReceipt"
import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import { toBase64 } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import FormGroup from "./FormGroup"

enum Key {
  value = "value",
}

interface Props {
  type: Type
  symbol: string
  tab: Tab
  /** Gov stake */
  gov?: boolean
}

const StakeForm = ({ type, symbol, tab, gov }: Props) => {
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
  const { contracts, getListedItem } = useContractsAddress()
  const { find, parsed } = useContract()
  useRefetch([balanceKey, !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED])

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const max = find(balanceKey, symbol)
    return { [Key.value]: v.amount(value, { symbol, max }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)

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
      help: renderBalance(find(balanceKey, symbol), symbol),
      unit: gov ? MIR : LP,
    },
  })

  /* confirm */
  const staked = find(
    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
    symbol
  )

  const contents = !value
    ? undefined
    : gt(staked, 0)
    ? [{ title: "Staked", content: formatAsset(staked, getLpName(symbol)) }]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { token, lpToken } = getListedItem(symbol)
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
