import classNames from "classnames/bind"
import { gt } from "../libs/math"
import { format, getIsBig, lookupSymbol } from "../libs/parse"
import useCount from "./useCount"
import styles from "./Formatted.module.scss"

const cx = classNames.bind(styles)

const Formatted = ({ children = "0", ...props }: FormattedOptions) => {
  const count = useCount(children)
  const { symbol, unit, plus, big, noUnit, noCount, className } = props
  const current = noCount ? children : count
  const formatted = props.format?.(current) ?? format(current, symbol, props)
  const isBig = getIsBig(current, symbol)
  const [integer, decimal] = isBig ? [formatted] : formatted.split(".")

  return (
    <span className={cx(styles.component, { big }, className)}>
      {plus && gt(current, 0) && "+"}
      {integer}
      <small>
        {decimal && "."}
        {decimal} {unit ?? (!noUnit && lookupSymbol(symbol))}
      </small>
    </span>
  )
}

export default Formatted
