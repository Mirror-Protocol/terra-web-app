import classNames from "classnames/bind"
import { format, getIsBig, lookupSymbol } from "../libs/parse"
import styles from "./Formatted.module.scss"

const cx = classNames.bind(styles)

interface Props {
  symbol?: string
  config?: FormatConfig
  children?: string
  unit?: string
  big?: boolean
  className?: string
  noUnit?: boolean
}

const Formatted = ({ symbol, children = "0", className, ...props }: Props) => {
  const { config, unit, big, noUnit } = props
  const formatted = format(children, symbol, config)
  const isBig = getIsBig(children, symbol)
  const [integer, decimal] = isBig ? [formatted] : formatted.split(".")

  return (
    <span className={cx(styles.component, { big }, className)}>
      {integer}
      <small>
        {decimal && "."}
        {decimal} {unit ?? (!noUnit && lookupSymbol(symbol))}
      </small>
    </span>
  )
}

export default Formatted
