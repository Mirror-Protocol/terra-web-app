import { FC, ReactNode } from "react"
import styles from "./Summary.module.scss"

interface Props {
  title: ReactNode
  footer?: string
}

const Summary: FC<Props> = ({ title, footer, children }) => (
  <article className={styles.article}>
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
      <section className={styles.content}>{children}</section>
    </div>

    {footer && <footer className={styles.footer}>{footer}</footer>}
  </article>
)

export default Summary
