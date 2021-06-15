import { FC, ReactNode } from "react"
import Boundary from "./Boundary"
import Container from "./Container"
import Icon from "./Icon"
import styles from "./Page.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: ReactNode
  doc?: string
  sm?: boolean
}

const Page: FC<Props> = ({ title, description, children, ...props }) => {
  const { action, select, sm } = props

  return (
    <article className={styles.article}>
      {title && (
        <header className={styles.header}>
          <section className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>

            {select && (
              <div className={styles.select}>
                {select}
                <Icon name="ChevronDown" size={8} />
              </div>
            )}
          </section>

          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      {description && (
        <section className={styles.description}>{description}</section>
      )}

      <Boundary>
        {sm ? <Container sm>{children}</Container> : children}
      </Boundary>
    </article>
  )
}

export default Page
