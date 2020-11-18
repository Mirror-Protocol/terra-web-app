import React from "react"
import { MEDIUM, DISCORD, TELEGRAM, WECHAT, GITHUB } from "../constants"
import medium from "../images/Community/medium.png"
import discord from "../images/Community/discord.png"
import telegram from "../images/Community/telegram.png"
import wechat from "../images/Community/wechat.png"
import github from "../images/Community/github.png"
import { useNetwork } from "../hooks"
import Container from "../components/Container"
import ExtLink from "../components/ExtLink"
import Icon from "../components/Icon"
import styles from "./Footer.module.scss"

const community = [
  { href: MEDIUM, src: medium, alt: "Medium" },
  { href: DISCORD, src: discord, alt: "Discord" },
  { href: TELEGRAM, src: telegram, alt: "Telegram" },
  { href: WECHAT, src: wechat, alt: "Wechat" },
  { href: GITHUB, src: github, alt: "Github" },
]

const Footer = () => {
  const { key: current } = useNetwork()

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <section className={styles.network}>
          <Icon name="wifi_tethering" size={20} />
          {current}
        </section>

        <section className={styles.community}>
          {community.map(
            ({ href, src, alt }) =>
              href && (
                <ExtLink href={href} className={styles.link} key={alt}>
                  <img src={src} alt={alt} width={20} height={20} />
                </ExtLink>
              )
          )}
        </section>
      </Container>
    </footer>
  )
}

export default Footer
