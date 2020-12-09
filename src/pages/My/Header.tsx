import { ReactNode } from "react"
import styles from "./Header.module.scss"

const Header = ({ total, hide }: { total: ReactNode; hide: ReactNode }) => (
  <header className={styles.flex}>
    {total}
    <aside className={styles.hide}>{hide}</aside>
  </header>
)

export default Header
