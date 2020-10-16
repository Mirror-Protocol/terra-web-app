import React from "react"
import { useRouteMatch } from "react-router-dom"
import classNames from "classnames/bind"

import MESSAGE from "../lang/MESSAGE.json"
import { MIR } from "../constants"
import { gt } from "../libs/math"
import { lookup } from "../libs/parse"
import useNewContractMsg from "../terra/useNewContractMsg"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import { validate as v } from "./formHelpers"
import useForm from "./useForm"
import FormContainer from "./FormContainer"
import FormGroup from "./FormGroup"
import styles from "./VoteForm.module.scss"

const cx = classNames.bind(styles)

enum Key {
  answer = "answer",
}

enum AnswerKey {
  Y = "yes",
  N = "no",
}

const VoteForm = ({ tab }: { tab: Tab }) => {
  const balanceKey = BalanceKey.MIRGOVSTAKED

  /* context */
  const { find } = useContract()
  const { params } = useRouteMatch<{ id: string }>()
  const id = Number(params.id)
  useRefetch([balanceKey])

  /* form:validate */
  const validate = ({ answer }: Values<Key>) => ({
    [Key.answer]: v.required(answer),
  })

  /* form:hook */
  const initial = { [Key.answer]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, handleChange, attrs, invalid } = form
  const amount = find(balanceKey, MIR)
  const value = lookup(amount, MIR)

  /* render:form */
  const fields = {
    value: {
      label: "Amount",
      value,
    },
  }

  /* confirm */
  const contents = values[Key.answer] ? [] : undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { contracts } = useContractsAddress()
  const data = [
    newContractMsg(contracts["gov"], {
      cast_vote: {
        poll_id: id,
        vote: values[Key.answer],
        amount,
      },
    }),
  ]

  const disabled = invalid || !gt(value, 0)
  const messages = [MESSAGE.Confirm.Warning.Vote]
  const container = { contents, data, disabled, messages, tab, attrs }

  return (
    <FormContainer {...container} parserKey="gov" gov>
      <div className={styles.list}>
        {Object.values(AnswerKey).map((answer) => {
          const checked = answer === values[Key.answer]

          return (
            <div className={styles.wrapper} key={answer}>
              <input
                type="radio"
                name={Key.answer}
                id={answer}
                value={answer}
                onChange={handleChange}
                checked={checked}
                hidden
              />

              <label
                htmlFor={answer}
                className={cx(styles.answer, answer, { checked })}
              >
                {answer}
              </label>
            </div>
          )
        })}
      </div>

      <FormGroup {...fields["value"]} />
    </FormContainer>
  )
}

export default VoteForm
