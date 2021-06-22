import { FC, ReactNode } from "react"
import Container from "../components/Container"
import styles from "./Layout.module.scss"

interface Props {
  nav: ReactNode
  menu: ReactNode
  header: ReactNode
  banner: ReactNode
  footer: ReactNode
}

const Layout: FC<Props> = ({ nav, menu, header, banner, footer, children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.aside}>
        <div className={styles.wrapper}>
          {nav}
          {menu}
        </div>

        <footer className={styles.footer}>{footer}</footer>
      </div>

      <div className={styles.header}>{header}</div>
      <div className={styles.banner}>{banner}</div>
      <Container>{children}</Container>

      <div className={styles.navigate}>{menu}</div>
    </div>
  )
}

export default Layout
