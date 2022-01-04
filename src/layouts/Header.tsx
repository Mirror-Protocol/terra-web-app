import React from "react"
import { ReactComponent as Logo } from "../images/TerraswapLogo.svg"
import Container from "../components/Container"
import Connect from "./Connect"
import styles from "./Header.module.scss"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"
import styled from "styled-components"

const SidebarWrapper = styled(Container)`
  position: relative;
  z-index: 4900;

  width: 100%;
  height: auto;
  position: fixed;
  padding-top: 50px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    padding: 0;
  }
`

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

      <SidebarWrapper className={styles.container}>
        <Sidebar />
      </SidebarWrapper>
    </>
  )
}

export default Header
