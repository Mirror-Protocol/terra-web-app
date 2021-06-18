import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Grid.module.scss"

const cx = classNames.bind(styles)

export const Gutter: FC = ({ children }) => (
  <div className={styles.gutter}>{children}</div>
)

interface Props {
  wrap?: number
  className?: string
}

const Grid: FC<Props> = ({ children, wrap, className }) => (
  <div className={cx(styles.row, { wrap, [`wrap-${wrap}`]: wrap }, className)}>
    {children}
  </div>
)

export default Grid
