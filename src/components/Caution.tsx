import { FC } from "react"
import classNames from "classnames"
import styles from "./Caution.module.scss"

const Caution: FC<{ className?: string }> = ({ className, children }) => (
  <div className={classNames(styles.component, className)}>{children}</div>
)

export default Caution
