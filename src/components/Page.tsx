import { FC, ReactNode } from "react"
import Boundary from "./Boundary"
import Container from "./Container"
import Select, { Props as SelectProps } from "./Select"
import styles from "./Page.module.scss"

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
            <h1 className={styles.title}>{title}</h1>

            {select && <Select {...getSelectAttrs(select)} />}
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
