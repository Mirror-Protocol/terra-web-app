import { ReactNode, SelectHTMLAttributes, DetailedHTMLProps } from "react"
import { useRef } from "react"
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react"
import classNames from "classnames/bind"
import { lookupSymbol } from "../libs/parse"
import { Content } from "./componentTypes"
import Icon from "./Icon"
import AssetIcon from "./AssetIcon"
import styles from "./FormGroup.module.scss"

const cx = classNames.bind(styles)

export type Input = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type TextArea = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

export type Select = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

export interface FormGroupInterface {
  prev?: string
  input?: Input
  textarea?: TextArea
  select?: Select
  value?: ReactNode
  label?: ReactNode
  help?: Content
  unit?: ReactNode
  max?: () => void
  assets?: ReactNode
  focused?: boolean
  error?: string
  warn?: ReactNode
  info?: ReactNode
  type?: 1 | 2 | 3
  size?: AssetSize
  skipFeedback?: boolean
  unitAfterValue?: boolean
}

const FormGroup = (props: FormGroupInterface) => {
  const { prev, input, textarea, select, value } = props
  const { label, help, unit, max, assets, focused, error, warn, info } = props
  const { type = 1, size = "sm", skipFeedback } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const inputAttrs: Input = {
    ...input,
    inputMode: "numeric",
    onWheel: () => inputRef.current?.blur(),
  }

  const border = cx(styles.border, { focused, error, warn, readOnly: value })
  const unitAfterValue = unit === "%" || props.unitAfterValue

  const renderUnit = () => (
    <section className={styles.unit}>
      {typeof unit === "string" && (
        <AssetIcon symbol={unit} className={styles.icon} size={size} />
      )}

      {typeof unit === "string" ? lookupSymbol(unit) : unit}
    </section>
  )

  const renderLabel = () => (
    <header className={styles.header}>
      <section className={styles.label}>
        <label htmlFor={input?.id}>{label}</label>
      </section>

      {(unit || help) && (
        <section className={styles.meta}>
          {prev && renderUnit()}
          <section
            className={cx(styles.help, { clickable: max })}
            onClick={max}
          >
            <Icon name="Wallet" className={cx({ hidden: !isBalance })} />
            {help && !isBalance && `${help.title}: `}
            <strong>{help?.content}</strong>
          </section>
        </section>
      )}
    </header>
  )

  const renderInput = () => (
    <section className={cx((type === 2 || type === 3) && border)}>
      <section className={styles.wrapper}>
        {!prev && !unitAfterValue && renderUnit()}

        <section className={styles.field}>
          {input ? (
            <input {...inputAttrs} ref={inputRef} />
          ) : textarea ? (
            <textarea {...textarea} />
          ) : select ? (
            <div className={styles.select}>{select}</div>
          ) : (
            <span>{value}</span>
          )}
        </section>

        {!prev && unitAfterValue && renderUnit()}
      </section>

      {assets && <section className={styles.assets}>{assets}</section>}
    </section>
  )

  const renderInputWithPrev = () => (
    <section className={styles.grid}>
      <section className={classNames(styles.border, styles.readOnly)}>
        {prev}
      </section>
      <Icon name="ArrowDown" className={styles.arrow} size={20} />
      {renderInput()}
    </section>
  )

  const isBalance = help?.title === "Balance"

  return (
    <div className={cx(styles.group, styles.component, `type-${type}`)}>
      <div className={cx(type === 1 && border)}>
        {(label || help) && renderLabel()}
        {prev ? renderInputWithPrev() : renderInput()}
      </div>

      {!skipFeedback && (error || warn || info) && (
        <section className={cx(styles.feedback, { warn, info })}>
          {error || warn || info}
        </section>
      )}
    </div>
  )
}

export default FormGroup
