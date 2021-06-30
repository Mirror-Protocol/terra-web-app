import classNames from "classnames"
import { div, gt, isFinite, lt } from "../libs/math"
import { percentage } from "../libs/num"

interface Props {
  color?: "blue" | "red"
  children: string
  dp?: number
}

const MIN = div(0.01, 100) // 0.01%
const Percent = ({ color, children: value, dp }: Props) => {
  const lessThanMinimum = lt(value, MIN) && gt(value, 0)
  const prefix = lessThanMinimum ? "<" : ""

  return !isFinite(value) ? null : (
    <span className={classNames(color)}>
      {prefix + percentage(value, dp)}
      <small>%</small>
    </span>
  )
}

export default Percent
