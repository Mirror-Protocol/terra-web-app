import { FC, ReactNode } from "react"
import { DOCS } from "../constants"
import Container from "./Container"
import ExtLink from "./ExtLink"
import Icon from "./Icon"
import styles from "./Page.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: ReactNode
  doc?: string
  sm?: boolean
  noBreak?: boolean
}

const Page: FC<Props> = ({ title, description, children, ...props }) => {
  const { doc, action, select, sm, noBreak } = props

  return (
    <article className={styles.article}>
      {title && (
        <header className={styles.header}>
          <section className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>

            {select && (
              <div className={styles.select}>
                {select}
                <Icon name="arrow_drop_down" size={18} />
              </div>
            )}

            {doc && (
              <ExtLink href={DOCS + doc} className={styles.doc}>
                <Icon name="article" size={12} className={styles.icon} />
                Docs
              </ExtLink>
            )}
          </section>
          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      {description && (
        <section className={styles.description}>{description}</section>
      )}

      {!!title && !noBreak && <hr />}

      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page
