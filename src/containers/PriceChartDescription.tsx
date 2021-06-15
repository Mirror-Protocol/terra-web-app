import { useState } from "react"
import classNames from "classnames/bind"
import Icon from "../components/Icon"
import styles from "./PriceChartDescription.module.scss"

const cx = classNames.bind(styles)

const PriceChartDescription = ({ children = "" }) => {
  const isLong = children.split(" ").length > 32
  const [isOpen, setIsOpen] = useState(!isLong)
  const toggle = () => setIsOpen((isOpen) => !isOpen)

  return !children ? null : isLong ? (
    <button className={styles.component} onClick={toggle}>
      <p className={cx({ collapsed: !isOpen })}>{children}</p>

      {isLong && !isOpen && (
        <span className={styles.button}>
          More
          <Icon name="ChevronDown" size={8} />
        </span>
      )}
    </button>
  ) : (
    <p className={styles.component}>{children}</p>
  )
}

export default PriceChartDescription
