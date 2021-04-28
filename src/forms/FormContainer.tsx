import { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import { Msg } from "@terra-money/terra.js"

import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { UUSD } from "../constants"
import { gt, plus, sum } from "../libs/math"
import useHash from "../libs/useHash"
import extension, { PostResponse } from "../terra/extension"
import { useContract, useSettings, useWallet } from "../hooks"
import useTax from "../graphql/useTax"
import useFee from "../graphql/useFee"

import Container from "../components/Container"
import Tab from "../components/Tab"
import Card from "../components/Card"
import Confirm from "../components/Confirm"
import FormFeedback from "../components/FormFeedback"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"

import Caution from "./Caution"
import Result from "./Result"

interface Props {
  data: Msg[]
  memo?: string

  /** Form information */
  contents?: Content[]
  /** uusd amount for tax calculation */
  pretax?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** Form feedback */
  messages?: ReactNode[]

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: string

  /** Render tab */
  tab?: Tab
  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  /** Parser for results */
  parseTx?: ResultParser
  /** Gov tx */
  gov?: boolean

  children?: ReactNode
}

export const FormContainer = ({ data: msgs, memo, ...props }: Props) => {
  const { contents, messages, label, tab, children } = props
  const { attrs, pretax, deduct, parseTx = () => [], gov } = props

  /* context */
  const { hash } = useHash()
  const { agreementState } = useSettings()
  const [hasAgreed] = agreementState

  const { uusd, result } = useContract()
  const { address, connect } = useWallet()
  const { loading } = result.uusd

  /* tax */
  const fee = useFee()
  const { calcTax, loading: loadingTax } = useTax()
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax, fee.amount])
    : fee.amount

  const invalid =
    address && !loading && !gt(uusd, uusdAmount)
      ? ["Not enough UST"]
      : undefined

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const confirm = () => (hasAgreed ? submit() : setConfirming(true))
  const cancel = () => setConfirming(false)

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const disabled =
    loadingTax || props.disabled || invalid || submitted || !msgs?.length

  const submit = async () => {
    setSubmitted(true)

    const response = await extension.post(
      { msgs, memo },
      { ...fee, tax: !deduct ? tax : undefined }
    )

    setResponse(response)
  }

  /* reset */
  const reset = () => {
    setConfirming(false)
    setSubmitted(false)
    setResponse(undefined)
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
          children: label ?? hash ?? "Submit",
          loading: submitted,
          disabled,
        }
      : {
          onClick: connect,
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const txFee = (
      <Count symbol={UUSD} dp={6}>
        {plus(tax, fee.amount)}
      </Count>
    )

    const form = (
      <>
        {children}

        {contents && (
          <Confirm
            list={[
              ...contents,
              {
                title: (
                  <TooltipIcon content={Tooltip.Forms.TxFee}>
                    Tx Fee
                  </TooltipIcon>
                ),
                content: txFee,
              },
            ]}
          />
        )}

        {(invalid ?? messages)?.map((message, index) => (
          <FormFeedback key={index}>{message}</FormFeedback>
        ))}

        <Button {...next} type="button" size="lg" submit />
      </>
    )

    return tab ? <Tab {...tab}>{form}</Tab> : <Card lg>{form}</Card>
  }

  return (
    <Container sm>
      {response ? (
        <Result {...response} parseTx={parseTx} onFailure={reset} gov={gov} />
      ) : (
        <form {...attrs} onSubmit={handleSubmit}>
          {!confirming ? (
            render(children)
          ) : (
            <Caution goBack={cancel} onAgree={submit} />
          )}
        </form>
      )}
    </Container>
  )
}

export default FormContainer
