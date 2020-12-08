import { ReactNode } from "react"
import classNames from "classnames/bind"
import { abs, gt, gte, lt } from "../libs/math"
import { percent } from "../libs/num"
import Icon from "./Icon"
import styles from "./Change.module.scss"

const cx = classNames.bind(styles)

interface Props {
  price?: ReactNode
  className?: string
  children?: string
}

const Change = ({ price, className, children }: Props) => {
  const change = children && (gte(abs(children), 0.0001) ? children : "0")

  const render = (change: string) => {
    const up = gt(change, 0)
    const down = lt(change, 0)
    const icon = up ? "trending_up" : down ? "trending_down" : "arrow_right_alt"
    return (
      <span className={cx(styles.flex, styles.change, { up, down })}>
        <Icon name={icon} size="150%" />
        {percent(abs(change))}
      </span>
    )
  }

  return price ? (
    <span className={cx(styles.flex, className)}>
      <span className={styles.price}>{price}</span>
      {change && render(change)}
    </span>
  ) : change ? (
    render(change)
  ) : null
}

export default Change
