import classNames from "classnames"
import { isFinite } from "../libs/math"
import { percentage } from "../libs/num"

interface Props {
  color?: "blue" | "red"
  children: string
  dp?: number
}

const Percent = ({ color, children, dp }: Props) => {
  return !isFinite(children) ? null : (
    <span className={classNames(color)}>
      {percentage(children, dp)}
      <small>%</small>
    </span>
  )
}

export default Percent
