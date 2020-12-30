import classNames from "classnames"

interface Props {
  name: string
  size?: string | number
  className?: string
}

const Icon = ({ name, size, className }: Props) => (
  <i
    className={classNames("material-icons", className)}
    style={{ fontSize: size, width: size }}
  >
    {name}
  </i>
)

export default Icon
