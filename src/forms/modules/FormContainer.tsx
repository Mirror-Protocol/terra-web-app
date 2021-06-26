import { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import { useLocation } from "react-router-dom"
import { Msg, StdFee } from "@terra-money/terra.js"
import { useWallet } from "@terra-money/wallet-provider"
import { TxResult } from "@terra-money/wallet-provider"
import { UserDenied, CreateTxFailed } from "@terra-money/wallet-provider"
import { TxFailed, TxUnspecifiedError } from "@terra-money/wallet-provider"

import MESSAGE from "../../lang/MESSAGE.json"
import Tooltips from "../../lang/Tooltips"
import { gt, plus, sum } from "../../libs/math"
import { capitalize } from "../../libs/utils"
import useHash from "../../libs/useHash"
import useLocalStorage from "../../libs/useLocalStorage"
import { useAddress } from "../../hooks"
import useTax from "../../hooks/useTax"
import useFee from "../../hooks/useFee"
import { useUusdBalance } from "../../data/native/balance"

import { useModal } from "../../containers/Modal"
import ConnectListModal from "../../layouts/ConnectListModal"
import Card from "../../components/Card"
import Confirm from "../../components/Confirm"
import FormFeedback from "../../components/FormFeedback"
import Button, { Submit } from "../../components/Button"
import Formatted from "../../components/Formatted"
import { TooltipIcon } from "../../components/Tooltip"
import { Content } from "../../components/componentTypes"

import Caution from "./Caution"
import Result from "./Result"

interface Props {
  data: Msg[]
  memo?: string
  gasAdjust?: number

  /** Form information */
  contents?: Content[]
  /** uusd amount for tax calculation */
  pretax?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** Form feedback */
  messages?: ReactNode[]
  warnings?: ReactNode[]

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: string

  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  /** Parser for results */
  parseTx?: ResultParser
  /** Gov tx */
  gov?: boolean

  children?: ReactNode
  full?: boolean
}

export type PostError =
  | UserDenied
  | CreateTxFailed
  | TxFailed
  | TxUnspecifiedError

export const Component = ({ data: msgs, memo, gasAdjust, ...props }: Props) => {
  const { contents, messages, warnings, label, children, full } = props
  const { attrs, pretax, deduct, parseTx = () => [], gov } = props

  /* context */
  const modal = useModal()
  const { post } = useWallet()
  const { hash } = useHash()
  const [agreed, setAgreed] = useLocalStorage("agreement", false)
  const agree = () => {
    setAgreed(true)
    submit()
  }

  const uusd = useUusdBalance()
  const address = useAddress()

  /* tax */
  const fee = useFee(msgs?.length, gasAdjust)
  const { calcTax } = useTax()
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax, fee.amount])
    : fee.amount

  const invalidMessages =
    address && !gt(uusd, uusdAmount) ? ["Not enough UST"] : undefined

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const confirm = () => (agreed ? submit() : setConfirming(true))

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<TxResult>()
  const [error, setError] = useState<PostError>()
  const disabled =
    props.disabled || !!invalidMessages || submitted || !msgs?.length

  const submit = async () => {
    setSubmitted(true)

    try {
      const { gas, gasPrice, amount } = fee
      const txOptions = {
        msgs,
        memo,
        gasPrices: `${gasPrice}uusd`,
        fee: new StdFee(gas, { uusd: plus(amount, !deduct ? tax : undefined) }),
        purgeQueue: true,
      }

      const response = await post(txOptions)
      setResponse(response)
    } catch (error) {
      setError(error)
    }
  }

  /* reset */
  const reset = () => {
    setConfirming(false)
    setSubmitted(false)
    setResponse(undefined)
    setError(undefined)
  }

  /* event */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    !disabled && submit()
  }

  /* render */
  const render = (children: ReactNode | ((button: ReactNode) => ReactNode)) => {
    const next = address
      ? {
          onClick: confirm,
          children: capitalize(label ?? hash ?? "Submit"),
          loading: submitted,
          disabled,
        }
      : {
          onClick: () => modal.open(),
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const txFeeTitle = (
      <TooltipIcon content={Tooltips.Forms.TxFee}>Tx Fee</TooltipIcon>
    )

    const txFee = (
      <Formatted symbol="uusd" dp={6}>
        {plus(!deduct ? tax : 0, fee.amount)}
      </Formatted>
    )

    const renderConfirm = (contents: Content[]) => (
      <Confirm list={[...contents, { title: txFeeTitle, content: txFee }]} />
    )

    return (
      <>
        <Card confirm={contents && renderConfirm(contents)} lg full={full}>
          {children}
        </Card>

        {(invalidMessages ?? messages)?.map((message, index) => (
          <FormFeedback type="error" key={index}>
            {message}
          </FormFeedback>
        ))}

        {warnings?.map((message, index) => (
          <FormFeedback type="warn" key={index}>
            {message}
          </FormFeedback>
        ))}

        <Submit>
          <Button {...next} type="button" size="lg" />
        </Submit>
      </>
    )
  }

  return (
    <>
      {error || response ? (
        <Result
          response={response}
          error={error}
          parseTx={parseTx}
          onFailure={reset}
          gov={gov}
        />
      ) : (
        <form {...attrs} onSubmit={handleSubmit}>
          {!confirming ? render(children) : <Caution onAgree={agree} />}
        </form>
      )}

      {!address && <ConnectListModal {...modal} />}
    </>
  )
}

const FormContainer = (props: Props) => {
  const { hash } = useLocation()
  return <Component {...props} key={hash} />
}

export default FormContainer
