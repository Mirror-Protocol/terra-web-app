import React from "react"

import classNames from "classnames/bind"
import styles from "./SwapFormGroup.module.scss"
import Button from "../components/Button"
import FeeCombobox from "./FeeCombobox"

const cx = classNames.bind(styles)

const SwapFormGroup = ({
  input,
  textarea,
  select,
  value,
  ...props
}: FormGroup) => {
  const {
    label,
    help,
    unit,
    max,
    assets,
    focused,
    error,
    type = 1,
    feeSymbol,
    feeSelect,
  } = props
  const { skipFeedback } = props

  const border = cx(styles.border, { focused, error, readOnly: value })
  const maxProps = {
    type: "button",
    className: styles.max,
    onClick: max,
    color: "#0222ba00",
    size: "xs",
    outline: true,
    children: "Max",
  }

  return (
    <div className={styles.component}>
      <div className={cx(type === 1 && border)}>
        {label && (
          <header className={styles.header}>
            <section className={styles.label}>
              <label htmlFor={input?.id}>{label}</label>
            </section>

            {help && (
              <section className={styles.help}>
                {help.title}: <strong>{help.content}</strong>
              </section>
            )}
            {max && <Button {...maxProps} />}
          </header>
        )}

        <section className={cx(type === 2 && border)}>
          <section className={styles.wrapper}>
            <section className={styles.field}>
              {input ? (
                <input {...input} />
              ) : textarea ? (
                <textarea {...textarea} />
              ) : select ? (
                <div className={styles.select}>{select}</div>
              ) : (
                <span>{value}</span>
              )}
            </section>

            <section className={styles.unit}>{unit}</section>
          </section>
          {assets && <section className={styles.assets}>{assets}</section>}
        </section>
      </div>
      <div className={styles.bottom}>
        {!skipFeedback && <p className={styles.feedback}>{error}</p>}
        {feeSymbol && feeSelect && (
          <FeeCombobox selected={feeSymbol} onSelect={feeSelect} />
        )}
      </div>
    </div>
  )
}

export default SwapFormGroup
