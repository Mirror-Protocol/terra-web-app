import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Grid.module.scss"

const cx = classNames.bind(styles)

export const Gutter: FC = ({ children }) => (
  <div className={styles.gutter}>{children}</div>
)

const Grid: FC<{ wrap?: number }> = ({ children, wrap }) => (
  <div className={cx(styles.row, { wrap, [`wrap-${wrap}`]: wrap })}>
    {children}
  </div>
)

export default Grid
