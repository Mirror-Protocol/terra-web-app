import React from "react"

import classNames from "classnames/bind"
import styles from "./FormGroup.module.scss"

const cx = classNames.bind(styles)

const FormGroup = ({ input, textarea, select, value, ...props }: FormGroup) => {
  const { label, help, unit, assets, focused, error, type = 1 } = props
  const { skipFeedback } = props

  const border = cx(styles.border, { focused, error, readOnly: value })

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

      {error && !skipFeedback && <p className={styles.feedback}>{error}</p>}
    </div>
  )
}

export default FormGroup
