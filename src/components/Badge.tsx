import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Badge.module.scss"

const cx = classNames.bind(styles)

interface Props {
  className?: string
  bg?: string
}

const Badge: FC<Props> = ({ className, children, bg }) => (
  <span className={cx(styles.badge, className, `bg-${bg}`)}>{children}</span>
)

export default Badge
