import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Container.module.scss"

const cx = classNames.bind(styles)

interface Props {
  className?: string
  sm?: boolean
}

const Container: FC<Props> = ({ children, className, sm }) => (
  <div className={cx(!sm ? "container" : "sm", className)}>{children}</div>
)

export default Container
