import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import Tippy from "@tippyjs/react"
import classNames from "classnames/bind"
import Tooltips from "../../lang/Tooltips"
import { gt, gte, isFinite, lt, lte } from "../../libs/math"
import * as slippage from "../../data/tx/slippage"
import { DropdownTippyProps, TooltipIcon } from "../../components/Tooltip"
import Dropdown from "../../components/Dropdown"
import Icon from "../../components/Icon"
import styles from "./SetSlippageTolerance.module.scss"

const cx = classNames.bind(styles)

const SlippageTolerance = () => {
  const list = ["0.1", "0.5", "1"]

  const [focused, setFocused] = useState(false)
  const [value, setValue] = useRecoilState(slippage.slippageInputState)
  const error = useRecoilValue(slippage.slippageInputErrorQuery)

  const setSlippage = (value: string) => {
    localStorage.setItem("slippage", value)
    setValue(value)
  }

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
        <TooltipIcon content={Tooltips.Trade.SlippageTolerance}>
          <h1 className={styles.title}>Slippage tolerance</h1>
        </TooltipIcon>
      </header>

      <section className={styles.list}>
        {list.map((item) => (
          <button
            className={cx(styles.item, { active: value === item })}
            onClick={() => setSlippage(item)}
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
            onChange={(e) => setSlippage(e.target.value)}
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

const SetSlippageTolerance = () => {
  const renderDropdown = () => (
    <Dropdown>
      <SlippageTolerance />
    </Dropdown>
  )

  return (
    <div className={styles.component}>
      <Tippy {...DropdownTippyProps} render={renderDropdown}>
        <button type="button" className={styles.button}>
          <Icon name="Settings" size={18} />
        </button>
      </Tippy>
    </div>
  )
}

export default SetSlippageTolerance
