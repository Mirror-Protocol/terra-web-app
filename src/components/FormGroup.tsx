import { useRef } from "react"
import classNames from "classnames/bind"
import Button from "./Button"
import styles from "./FormGroup.module.scss"

const cx = classNames.bind(styles)

const FormGroup = ({ input, textarea, select, value, ...props }: FormGroup) => {
  const { label, help, unit, max, assets, focused, error, type = 1 } = props
  const { skipFeedback } = props

  const inputRef = useRef<HTMLInputElement>()

  const handleWheel = () => {
    inputRef.current?.blur()
  }

  const border = cx(styles.border, { focused, error, readOnly: value })
  const maxProps = {
    type: "button",
    className: styles.max,
    onClick: max,
    color: "secondary",
    size: "xs",
    outline: true,
    children: "Max",
  }

  return (
    <div className={classNames(styles.group, styles.component)}>
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
                <input {...input} onWheel={handleWheel} ref={inputRef} />
              ) : textarea ? (
                <textarea {...textarea} />
              ) : select ? (
                <div className={styles.select}>{select}</div>
              ) : (
                <span>{value}</span>
              )}
            </section>

            {max && <Button {...maxProps} />}
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
