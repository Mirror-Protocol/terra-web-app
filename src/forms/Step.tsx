import { ReactNode } from "react"
import styles from "./Step.module.scss"

interface Props {
  index: number
  title: ReactNode
  content: ReactNode
  render: ReactNode
  action?: ReactNode
  info?: ReactNode
}

const Step = ({ index, title, content, render, action, info }: Props) => {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <section className={styles.index}>{index}</section>

        <div className={styles.wrapper}>
          <div className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.action}>{action}</div>
          </div>

          <p className={styles.content}>{content}</p>
        </div>
      </header>

      <section className={styles.render}>{render}</section>
      {info}
    </article>
  )
}

export default Step
