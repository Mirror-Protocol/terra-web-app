import { ReactNode } from "react"
import { Link } from "react-router-dom"
import styles from "./AppHeader.module.scss"

interface Props {
  logo: ReactNode
  connect: ReactNode
}

const AppHeader = ({ logo, connect }: Props) => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        {logo}
      </Link>

      <section className={styles.connect}>{connect}</section>
    </header>
  )
}

export default AppHeader
