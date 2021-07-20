import { FC, ReactNode } from "react"
import Boundary from "./Boundary"
import Container from "./Container"
import Select, { Props as SelectProps } from "./Select"
import styles from "./Page.module.scss"
import Notifications from "../layouts/Notifications"

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: SelectProps
  doc?: string
  sm?: boolean
}

const Page: FC<Props> = ({ title, description, children, ...props }) => {
  const { action, select, sm } = props
  const getSelectAttrs = (select: SelectProps) => ({
    ...select,
    attrs: { ...select.attrs, className: styles.select },
  })

  return (
    <article className={styles.article}>
      {title && (
        <header className={styles.header}>
          <section className={styles.heading}>
            <h1 className={styles.title}>
              {title}
              {description && (
                <span className={styles.description}>{description}</span>
              )}
            </h1>

            {select && <Select {...getSelectAttrs(select)} />}
          </section>

          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      <Boundary>
        {sm ? <Container sm>{children}</Container> : children}
        <Notifications />
      </Boundary>
    </article>
  )
}

export default Page
