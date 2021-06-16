import classNames from "classnames/bind"
import { abs, gt, gte, lt } from "../libs/math"
import { percent } from "../libs/num"
import Icon from "./Icon"
import styles from "./Change.module.scss"

const cx = classNames.bind(styles)

interface Props {
  children?: number
  align?: "left" | "center" | "right"
  inline?: boolean
}

const Change = ({ children, align = "left", inline }: Props) => {
  const change = children && (gte(abs(children), 0.0001) ? children : 0)

  const render = (change: number) => {
    const up = gt(change, 0)
    const down = lt(change, 0)
    const icon: IconNames | "" = up ? "UpSolid" : down ? "DownSolid" : ""

    return (
      <span
        className={cx(styles.flex, styles.change, align, { inline, up, down })}
      >
        {icon && <Icon name={icon} size={10} />}
        {percent(abs(change))}
      </span>
    )
  }

  return change ? render(change) : null
}

export default Change
