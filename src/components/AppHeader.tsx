import { useState, useEffect, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import Container from "./Container"
import Icon from "./Icon"
import Menu from "./Menu"
import Badge from "./Badge"
import styles from "./AppHeader.module.scss"

const cx = classNames.bind(styles)

interface Props {
  logo: ReactNode
  menu: MenuItem[]
  connect: ReactNode
  border?: boolean
  testnet?: boolean
}

const AppHeader = ({ logo, menu, connect, border, testnet }: Props) => {
  const { key } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const hideToggle = menu.every((item) => item.desktopOnly)

  useEffect(() => {
    setIsOpen(false)
  }, [key])

  return (
    <header className={cx(styles.header, { collapsed: !isOpen })}>
      <Container>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <h1>
              <Link to="/" className={styles.logo}>
                {logo}
              </Link>
            </h1>

            {testnet && <Badge className={styles.badge}>Testnet</Badge>}

            {!hideToggle && (
              <button className={styles.toggle} onClick={toggle}>
                <Icon name={!isOpen ? "menu" : "close"} size={24} />
              </button>
            )}
          </section>

          <section className={styles.support}>
            <Menu list={menu} key={key} />
            <div className={styles.connect}>{connect}</div>
          </section>
        </div>

        {border && !isOpen && <hr className={styles.hr} />}
      </Container>
    </header>
  )
}

export default AppHeader
