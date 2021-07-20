import { FC, ReactNode } from "react"
import classNames from "classnames/bind"
import { TooltipIcon } from "./Tooltip"
import styles from "./Summary.module.scss"

const cx = classNames.bind(styles)

interface Props {
  title: ReactNode
  tooltip?: string
  size?: "lg" | "sm" | "xs"
}

const Summary: FC<Props> = ({ title, children, tooltip, size }) => (
  <article className={cx(styles.article, size)}>
    <h1 className={styles.title}>
      {!tooltip ? title : <TooltipIcon content={tooltip}>{title}</TooltipIcon>}
    </h1>
    <section className={styles.content}>{children}</section>
  </article>
)

export default Summary
