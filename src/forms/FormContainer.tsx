import React, { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent, KeyboardEvent } from "react"
import { Msg } from "@terra-money/terra.js"
import MESSAGE from "../lang/MESSAGE.json"
import { UUSD } from "../constants"
import { plus } from "../libs/math"
import extension, { PostResponse } from "../terra/extension"
import { useNetwork, useSettings, useWallet } from "../hooks"
import useTax from "../graphql/useTax"
import Container from "../components/Container"
import Tab from "../components/Tab"
import Button from "../components/Button"
import Count from "../components/Count"
import useHash from "../pages/useHash"
import Caution from "./Caution"
import Confirm from "./Confirm"
import Result from "./Result"
import FormFeedback from "./FormFeedback"

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
  messages?: string[]

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: string

  /** Render tab */
  tab?: Tab
  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  parserKey?: string
  children?: ReactNode
}

export const FormContainer = ({ data: msgs, memo, ...props }: Props) => {
  const { contents = [], messages, label, tab, children } = props
  const { attrs, disabled, pretax, deduct, parserKey } = props

  /* context */
  const { hash } = useHash()
  const { lcd, fee } = useNetwork()
  const { hasAgreed } = useSettings()
  const { address, connect } = useWallet()
  const tax = useTax(pretax)

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const confirm = () => (hasAgreed ? submit() : setConfirming(true))
  const cancel = () => setConfirming(false)

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const submit = () => {
    setSubmitted(true)
    const id = extension.post(
      { msgs, memo, lcdClientConfig: lcd },
      { ...fee, tax: !deduct ? tax : undefined },
      (response) => response.id === id && setResponse(response)
    )
  }

  /* reset */
  const reset = () => {
    setConfirming(false)
    setSubmitted(false)
    setResponse(undefined)
  }

  /* event */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      !disabled && confirm()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  /* render */
  const render = (children: ReactNode | ((button: ReactNode) => ReactNode)) => {
    const next = address
      ? {
          onClick: confirm,
          children: hash ?? label ?? "Submit",
          loading: submitted,
          disabled: disabled || !msgs?.length || submitted,
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

        <Confirm list={[...contents, { title: "Tx Fee", content: txFee }]} />

        {messages?.map((message) => (
          <FormFeedback key={message}>{message}</FormFeedback>
        ))}

        <Button {...next} type="button" size="lg" submit />
      </>
    )

    return tab ? (
      <Tab {...tab}>{form}</Tab>
    ) : label ? (
      <Tab tabs={[label]} current={label}>
        {form}
      </Tab>
    ) : (
      form
    )
  }

  return (
    <Container sm>
      {response ? (
        <Result
          {...response}
          parserKey={parserKey ?? "default"}
          onFailure={reset}
        />
      ) : (
        <form {...attrs} onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
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
