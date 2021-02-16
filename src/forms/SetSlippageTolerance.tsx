import { useState } from "react"
import Tippy from "@tippyjs/react"
import classNames from "classnames/bind"
import Tooltip from "../lang/Tooltip.json"
import { gt, gte, isFinite, lt, lte } from "../libs/math"
import { LocalStorage } from "../libs/useLocalStorage"
import { DropdownTippyProps, TooltipIcon } from "../components/Tooltip"
import Dropdown from "../components/Dropdown"
import Icon from "../components/Icon"
import styles from "./SetSlippageTolerance.module.scss"

const cx = classNames.bind(styles)

const SlippageTolerance = ({ state, error }: Props) => {
  const [value, setValue] = state
  const [focused, setFocused] = useState(false)
  const list = ["0.1", "0.5", "1"]

  const feedback = error
    ? { status: "error", message: error }
    : gte(value, 50) || lte(value, 0) || !isFinite(value)
    ? { status: "error", message: "Enter a valid slippage percentage" }
    : gt(value, 5)
    ? { status: "warning", message: "Your transaction may be frontrun" }
    : lt(value, 0.5)
    ? { status: "warning", message: "Your transaction may fail" }
    : !list.includes(value)
    ? { status: "success" }
    : undefined

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <TooltipIcon content={Tooltip.Trade.SlippageTolerance}>
          <h1 className={styles.title}>Slippage tolerance</h1>
        </TooltipIcon>
      </header>

      <section className={styles.list}>
        {list.map((item) => (
          <button
            className={cx(styles.item, { active: value === item })}
            onClick={() => setValue(item)}
            key={item}
          >
            {item}%
          </button>
        ))}

        <section
          className={cx(styles.item, styles.group, focused && feedback?.status)}
        >
          <input
            className={cx(styles.input, {
              focused: focused || feedback?.status === "success",
            })}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <span>%</span>
        </section>
      </section>

      {feedback && (
        <p className={cx(styles.feedback, feedback.status)}>
          {feedback.message}
        </p>
      )}
    </div>
  )
}

interface Props {
  state: LocalStorage<string>
  error?: string
}

const SetSlippageTolerance = (props: Props) => {
  const renderDropdown = () => (
    <Dropdown>
      <SlippageTolerance {...props} />
    </Dropdown>
  )

  return (
    <div className={styles.component}>
      <Tippy {...DropdownTippyProps} render={renderDropdown}>
        <button type="button" className={styles.button}>
          <Icon name="settings" size={24} />
        </button>
      </Tippy>
    </div>
  )
}

export default SetSlippageTolerance
