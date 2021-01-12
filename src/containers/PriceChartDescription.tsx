import { useState } from "react"
import classNames from "classnames/bind"
import styles from "./PriceChartDescription.module.scss"

const cx = classNames.bind(styles)

const PriceChartDescription = ({ children = "" }) => {
  const isLong = children.split(" ").length
  const [isOpen, setIsOpen] = useState(!isLong)
  const toggle = () => setIsOpen((isOpen) => !isOpen)

  return !children ? null : isLong ? (
    <button
      className={cx(styles.component, { collapsed: !isOpen })}
      onClick={toggle}
    >
      {children}
      {isLong && !isOpen && <span className={styles.button}>more</span>}
    </button>
  ) : (
    <p className={styles.component}>{children}</p>
  )
}

export default PriceChartDescription
