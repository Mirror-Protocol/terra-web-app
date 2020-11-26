import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import { MenuKey, getPath } from "../routes"
import { ReactComponent as Logo } from "../images/Logo.svg"
import Container from "../components/Container"
import Icon from "../components/Icon"
import Menu from "./Menu"
import Connect from "./Connect"
import styles from "./Header.module.scss"

const cx = classNames.bind(styles)

const Header = () => {
  const { key } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [key])

  return (
    <header className={cx(styles.header, { collapsed: !isOpen })}>
      <Container className={styles.container}>
        <section className={styles.wrapper}>
          <h1>
            <Link to={getPath(MenuKey.DASHBOARD)} className={styles.logo}>
              <Logo height={24} />
            </Link>
          </h1>

          <button className={styles.toggle} onClick={toggle}>
            <Icon name={!isOpen ? "menu" : "close"} size={24} />
          </button>
        </section>

        <section className={styles.support}>
          <Menu key={key} />
          <div className={styles.connect}>
            <Connect />
          </div>
        </section>
      </Container>
    </header>
  )
}

export default Header
