import React from "react"
import { ReactComponent as Logo } from "../images/TerraswapLogo.svg"
import Container from "../components/Container"
import Connect from "./Connect"
import styles from "./Header.module.scss"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <Container className={styles.container}>
          <section className={styles.wrapper}>
            <Link to="/dashboard">
              <Logo height={38} className={styles.logo} />
            </Link>
          </section>

          <section className={styles.support}>
            <div className={styles.connect}>
              <Connect />
            </div>
          </section>
        </Container>
      </header>

      <Container className={styles.container}>
        <div style={{ position: "relative", zIndex: 4900 }}>
          <div
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 150,
              position: "fixed",
              paddingTop: 76 + 50,
            }}
          >
            <Sidebar />
          </div>
        </div>
      </Container>
    </>
  )
}

export default Header
