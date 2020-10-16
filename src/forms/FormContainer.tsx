import React, { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent, KeyboardEvent } from "react"
import { Msg } from "@terra-money/terra.js"
import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { UUSD } from "../constants"
import { gt, plus, sum } from "../libs/math"
import extension, { PostResponse } from "../terra/extension"
import { useContract, useNetwork, useSettings, useWallet } from "../hooks"
import useTax from "../graphql/useTax"
import Container from "../components/Container"
import Tab from "../components/Tab"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
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

  /** Parser for results */
  parserKey?: string
  /** Gov tx */
  gov?: boolean

  children?: ReactNode
}

export const FormContainer = ({ data: msgs, memo, ...props }: Props) => {
  const { contents, messages, label, tab, children } = props
  const { attrs, pretax, deduct, parserKey, gov } = props

  /* context */
  const { hash } = useHash()
  const { lcd, fee } = useNetwork()
  const { hasAgreed } = useSettings()
  const { uusd, result } = useContract()
  const { address, connect } = useWallet()
  const { loading } = result.uusd

  /* tax */
  const tax = useTax(pretax)
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax ?? "0", fee.amount])
    : fee.amount

  const invalid =
    !loading && !gt(uusd, uusdAmount) ? ["Not enough UST"] : undefined

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const confirm = () => (hasAgreed ? submit() : setConfirming(true))
  const cancel = () => setConfirming(false)

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const disabled = props.disabled || invalid || submitted || !msgs?.length
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

        {(invalid ?? messages)?.map((message) => (
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
          gov={gov}
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
