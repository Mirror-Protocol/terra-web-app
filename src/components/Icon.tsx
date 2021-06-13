import React from "react"
import classNames from "classnames"

interface Props {
  name: string
  size?: string | number
  className?: string
  color?: string
}

const Icon = ({ name, size, className, color }: Props) => (
  <i
    className={classNames("material-icons", className)}
    style={{ fontSize: size, color: color }}
  >
    {name}
  </i>
)

export default Icon
