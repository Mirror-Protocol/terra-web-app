import React from "react"

import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, MIR } from "../constants"
import { toAmount } from "../libs/parse"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import { Type } from "../pages/Stake"
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
  useRefetch([balanceKey])

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
      label: `Input amount to ${type}`,
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
  const container = { data, disabled, tab, attrs, messages, parserKey: "stake" }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value]} />
    </FormContainer>
  )
}

export default StakeForm
