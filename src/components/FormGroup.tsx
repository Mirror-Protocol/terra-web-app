import { useRef } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import AssetIcon from "./AssetIcon"
import styles from "./FormGroup.module.scss"

const cx = classNames.bind(styles)

const FormGroup = ({ input, textarea, select, value, ...props }: FormGroup) => {
  const { label, help, unit, max, assets, focused, error, warn, info } = props
  const { type = 1, skipFeedback } = props

  const inputRef = useRef<HTMLInputElement>()
  const inputAttrs = {
    ...input,
    inputMode: "numeric",
    onWheel: () => inputRef.current?.blur(),
    ref: inputRef,
  }

  const border = cx(styles.border, { focused, error, warn, readOnly: value })
  const unitAfterValue = unit === "%" || props.unitAfterValue

  const renderUnit = () => (
    <section className={styles.unit}>
      {typeof unit === "string" && (
        <AssetIcon symbol={unit} className={styles.icon} small />
      )}

      {unit}
    </section>
  )

  return (
    <div className={cx(styles.group, styles.component, `type-${type}`)}>
      <div className={cx(type === 1 && border)}>
        {label && (
          <header className={styles.header}>
            <section className={styles.label}>
              <label htmlFor={input?.id}>{label}</label>
            </section>

            {help && (
              <section
                className={cx(styles.help, { clickable: max })}
                onClick={max}
              >
                {help.title === "Balance" ? (
                  <Icon name="Wallet" />
                ) : (
                  `${help.title}: `
                )}

                <strong>{help.content}</strong>
              </section>
            )}
          </header>
        )}

        <section className={cx(type === 2 && border)}>
          <section className={styles.wrapper}>
            {!unitAfterValue && renderUnit()}

            <section className={styles.field}>
              {input ? (
                <input {...inputAttrs} />
              ) : textarea ? (
                <textarea {...textarea} />
              ) : select ? (
                <div className={styles.select}>{select}</div>
              ) : (
                <span>{value}</span>
              )}
            </section>

            {unitAfterValue && renderUnit()}
          </section>

          {assets && <section className={styles.assets}>{assets}</section>}
        </section>
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
