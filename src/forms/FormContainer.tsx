import React, { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent, KeyboardEvent } from "react"
import { useHistory } from "react-router-dom"
import { Msg } from "@terra-money/terra.js"
import MESSAGE from "../lang/MESSAGE.json"
import extension, { PostResponse } from "../terra/extension"
import { useNetwork, useSettings, useWallet } from "../hooks"
import Container from "../components/Container"
import Tab from "../components/Tab"
import Button from "../components/Button"
import useHash from "../pages/useHash"
import Caution from "./Caution"
import Confirm from "./Confirm"
import Result from "./Result"
import FormFeedback from "./FormFeedback"

interface Props {
  /** Confirm contents */
  confirm?: Confirm
  /** Skip form */
  skipForm?: boolean
  /** Skip confirm */
  skipConfirm?: boolean
  /** Post data */
  data: Msg[]
  memo?: string
  /** Form validation */
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
  const { confirm, messages, label, tab, children } = props
  const { attrs, disabled, parserKey, skipForm, skipConfirm } = props

  const { hash } = useHash()
  const { goBack } = useHistory()

  /* context */
  const { lcd } = useNetwork()
  const { hasAgreed } = useSettings()
  const { address, connect } = useWallet()

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const cancel = () => setConfirming(false)

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const submit = () => {
    setSubmitted(true)
    const id = extension.post(
      { msgs, memo, lcdClientConfig: lcd },
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
  const handleConfirm = () => {
    skipConfirm ? submit() : setConfirming(true)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      !disabled && handleConfirm()
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
          onClick: () => (skipConfirm ? submit() : handleConfirm()),
          children: hash ?? label ?? "Submit",
          loading: submitted,
          disabled: disabled || !msgs?.length || submitted,
        }
      : {
          onClick: connect,
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const form = (
      <>
        {children}
        {messages?.map((message) => (
          <FormFeedback key={message}>{message}</FormFeedback>
        ))}
        <Button {...next} type="button" size="lg" submit />
      </>
    )

    return tab ? <Tab {...tab}>{form}</Tab> : form
  }

  const confirmProps = {
    ...confirm,
    button: { loading: submitted, disabled: submitted },
    goBack: skipForm ? goBack : cancel,
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
          {!confirming && !skipForm ? (
            render(children)
          ) : hasAgreed ? (
            <Confirm {...confirmProps} />
          ) : (
            <Caution goBack={confirmProps.goBack} />
          )}
        </form>
      )}
    </Container>
  )
}

export default FormContainer
