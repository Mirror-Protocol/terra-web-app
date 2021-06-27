import { Link } from "react-router-dom"
import classNames from "classnames"
import { useNetwork } from "../hooks"
import Container from "../components/Container"
import Badge from "../components/Badge"
import Icon from "../components/Icon"
import Connect from "./Connect"
import styles from "./Header.module.scss"

const Header = () => {
  const { name } = useNetwork()

  return (
    <Container>
      <header className={styles.header}>
        <Link to="/" className={classNames(styles.item, "mobile")}>
          <Icon name="Mirror" size={26} />
        </Link>

        <section className={classNames(styles.item, styles.network)}>
          {name !== "mainnet" && (
            <Link to="/auth">
              <Badge bg="red">{name.toUpperCase()}</Badge>
            </Link>
          )}
        </section>

        <Connect className={styles.item} />
      </header>
    </Container>
  )
}

export default Header
