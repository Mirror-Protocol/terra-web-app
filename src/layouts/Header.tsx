import React, { useEffect, useState } from "react"
import { ReactComponent as Logo } from "../images/TerraswapLogo.svg"
import Container from "../components/Container"
import Connect from "./Connect"
import styles from "./Header.module.scss"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"
import styled, { css } from "styled-components"
import useMigration from "hooks/useMigration"

const SidebarWrapper = styled.div`
  position: relative;

  width: 100%;
  height: auto;
  position: fixed;
  padding-top: 50px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    z-index: 4900;
    padding: 0;
  }
`

const Banner = styled.div`
  width: 100%;
  height: auto;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #f15e7e;
  color: #ffffff;
  text-align: center;
  padding: 11px;

  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  z-index: 9999999;

  :hover {
    background-color: rgba(241, 94, 126, 0.8);
  }
`

const Header = () => {
  const { isMigrationPage } = useMigration()
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    let timerId: any
    const showConnectButtonAfter1Sec = () => {
      if (timerId) {
        clearTimeout(timerId)
      }

      timerId = setTimeout(() => {
        setIsScrolled(false)
      }, 875)
    }
    const handleWheel = () => {
      setIsScrolled(true)
      showConnectButtonAfter1Sec()
    }

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("touchmove", handleWheel)
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchmove", handleWheel)
    }
  }, [])

  useEffect(() => {
    if (isScrolled) {
      document.body.classList.add("scrolled", styles.scrolled)
      return
    }
    document.body.classList.remove("scrolled", styles.scrolled)
  }, [isScrolled])

  return (
    <>
      <Link to="/migration">
          <Banner>
            {isMigrationPage
              ? "Terraswap Classic - Migration Center"
              : "Terraswap Classic - Migration is now available, click here!"}
          </Banner>
      </Link>
      <header className={styles.header}>
        <Container className={styles.container}>
          <section className={styles.wrapper}>
            <Link to="/">
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

      <SidebarWrapper>
        <Container className={styles.container}>
          <Sidebar />
        </Container>
      </SidebarWrapper>
    </>
  )
}

export default Header
