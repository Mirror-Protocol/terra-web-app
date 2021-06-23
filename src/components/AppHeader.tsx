import { ReactNode } from "react"
import { Link } from "react-router-dom"
import styles from "./AppHeader.module.scss"

interface Props {
  logo: ReactNode
}

const AppHeader = ({ logo }: Props) => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        {logo}
      </Link>
    </header>
  )
}

export default AppHeader
