import { FC, PropsWithChildren, ReactNode } from "react"
import Container from "./Container"
import styles from "./SwapPage.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  sm?: boolean
}

const Page: FC<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
  ...props
}) => {
  const { sm } = props

  return (
    <article className={styles.article}>
      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page
