import React from "react"
import Container from "../components/Container"
import styles from "./SwapFooter.module.scss"
import { ReactComponent as Logo } from "../images/DelightLogo.svg"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <section className={styles.network}></section>

        <section className={styles.community}>
          <a href="https://delightlabs.io">
            <span>Terraswap powered by</span>
            <Logo height={24} />
          </a>
        </section>
      </Container>
    </footer>
  )
}

export default Footer
