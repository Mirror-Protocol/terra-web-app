import React from "react"
import { ReactComponent as Logo } from "../images/TerraswapLogo.svg"
import Container from "../components/Container"
import Connect from "./Connect"
import styles from "./SwapHeader.module.scss"

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <section className={styles.wrapper}>
          <a href="https://terraswap.io">
            <Logo height={38} className={styles.logo} />
          </a>
        </section>

        <section className={styles.support}>
          <div className={styles.connect}>
            <Connect />
          </div>
        </section>
      </Container>
    </header>
  )
}

export default Header
