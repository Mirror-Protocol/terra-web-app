import React, { useEffect, useState } from "react"
import { ReactComponent as Logo } from "../images/TerraswapLogo.svg"
import Container from "../components/Container"
import Connect from "./Connect"
import styles from "./Header.module.scss"
import { Link } from "react-router-dom"
import classNames from "classnames"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    let startY = 0
    const handleTouchStart = (e: TouchEvent) => {
      startY = e?.touches?.[0]?.pageY
    }
    const handleTouchMove = (e: TouchEvent) => {
      setIsScrolled(e?.touches?.[0]?.pageY < startY)
    }
    const handleWheel = (e: WheelEvent) => {
      setIsScrolled(e.deltaY > 0)
    }

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])
  return (
    <header
      className={classNames(styles.header, isScrolled && styles.scrolled)}
    >
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
  )
}

export default Header
