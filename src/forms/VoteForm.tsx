import { useEffect } from "react"
import { useRouteMatch } from "react-router-dom"
import classNames from "classnames/bind"

import MESSAGE from "../lang/MESSAGE.json"
import { MIR } from "../constants"
import { gt } from "../libs/math"
import { lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { placeholder, step, validate as v } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import useNewContractMsg from "../terra/useNewContractMsg"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import useGovReceipt from "./receipts/useGovReceipt"
import FormContainer from "./FormContainer"
import styles from "./VoteForm.module.scss"

const cx = classNames.bind(styles)

enum Key {
  answer = "answer",
  value = "value",
}

enum AnswerKey {
  Y = "yes",
  N = "no",
}

const VoteForm = ({ tab }: { tab: Tab }) => {
  const balanceKey = BalanceKey.MIRGOVSTAKED
  const symbol = MIR

  /* context */
  const { getToken } = useContractsAddress()
  const { find } = useContract()
  const { params } = useRouteMatch<{ id: string }>()
  const id = Number(params.id)
  useRefetch([balanceKey])

  /* form:validate */
  const max = find(balanceKey, getToken(symbol))
  const validate = ({ answer, value }: Values<Key>) => ({
    [Key.answer]: v.required(answer),
    [Key.value]: v.amount(value, { symbol, max }),
  })

  /* form:hook */
  const initial = { [Key.answer]: "", [Key.value]: max }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, handleChange, getFields } = form
  const { attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)

  /* set amount to max */
  useEffect(() => {
    setValues((values) => ({ ...values, [Key.value]: lookup(max, symbol) }))
  }, [max, setValues, symbol])

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
      unit: symbol,
      help: renderBalance(max, symbol),
      max: gt(max, 0)
        ? () => setValue(Key.value, lookup(max, symbol))
        : undefined,
    },
  })

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

  /* result */
  const parseTx = useGovReceipt()

  const container = { tab, attrs, contents, messages, disabled, data, parseTx }

  return (
    <FormContainer {...container} gov>
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
