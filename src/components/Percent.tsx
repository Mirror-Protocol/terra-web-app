import classNames from "classnames"
import { isFinite } from "../libs/math"
import { percentage } from "../libs/num"

interface Props {
  color?: "blue" | "red"
  children: string
}

const Percent = ({ color, children }: Props) => {
  return !isFinite(children) ? null : (
    <span className={classNames(color)}>
      {percentage(children)}
      <small>%</small>
    </span>
  )
}

export default Percent
