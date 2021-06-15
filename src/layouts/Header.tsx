import { Link } from "react-router-dom"
import classNames from "classnames"
import { DOCS } from "../constants"
import { useNetwork } from "../hooks"
import ExtLink from "../components/ExtLink"
import Badge from "../components/Badge"
import Icon from "../components/Icon"
import Connect from "./Connect"
import styles from "./Header.module.scss"

const Header = () => {
  const { name } = useNetwork()

  return (
    <header className={styles.header}>
      <Link to="/" className={classNames(styles.item, "mobile")}>
        <Icon name="Mirror" size={26} />
      </Link>

      <section className={styles.network}>
        {name !== "mainnet" && (
          <Link to="/auth">
            <Badge bg="red">{name.toUpperCase()}</Badge>
          </Link>
        )}
      </section>

      <Connect className={classNames(styles.item, "mobile")} />

      <ExtLink
        href={DOCS}
        className={classNames(styles.item, styles.docs, "desktop")}
      >
        <Icon name="Docs" size={22} />
      </ExtLink>
    </header>
  )
}

export default Header
