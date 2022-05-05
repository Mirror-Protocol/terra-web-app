import React, { useEffect, useRef, useState } from "react"

import classNames from "classnames/bind"
import styles from "./SwapFormGroup.module.scss"
import Button from "../components/Button"
import FeeCombobox from "./FeeCombobox"
import Loading from "components/Loading"

const cx = classNames.bind(styles)

const SwapFormGroup = ({
  input,
  textarea,
  select,
  value,
  isLoading,
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
  const inputRef = useRef<HTMLInputElement | null>()
  const [inputFontSize, setInputFontSize] = useState(24)
  useEffect(() => {
    if (inputRef?.current) {
      const computedStyle = window.getComputedStyle(inputRef.current)
      const elSpan = document.createElement("span")
      elSpan.innerText = inputRef?.current?.value
      elSpan.style.visibility = "hidden"
      elSpan.style.position = "absolute"
      elSpan.style.left = "-9999px"
      elSpan.style.font = computedStyle.font
      elSpan.style.fontSize = "24px"
      document.body.appendChild(elSpan)
      const calculatedFontSize =
        (24 * inputRef.current.clientWidth) / elSpan.clientWidth
      document.body.removeChild(elSpan)
      if (calculatedFontSize > 24) {
        setInputFontSize(24)
        return
      }
      if (calculatedFontSize < 12) {
        setInputFontSize(12)
        return
      }
      setInputFontSize(calculatedFontSize)
      return
    }
    setInputFontSize(24)
  }, [input])

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
              {isLoading && <Loading color="#a0a0a0" />}
              {input ? (
                <input
                  {...input}
                  ref={(e) => {
                    input?.ref && input.ref(e)
                    inputRef.current = e
                  }}
                  style={{
                    fontSize: inputFontSize,
                    height: 38,
                    lineHeight: "38px",
                  }}
                />
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
