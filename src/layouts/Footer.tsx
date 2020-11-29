import { MEDIUM, DISCORD, TELEGRAM, WECHAT, GITHUB } from "../constants"
import medium from "../images/Community/medium.png"
import discord from "../images/Community/discord.png"
import telegram from "../images/Community/telegram.png"
import wechat from "../images/Community/wechat.png"
import github from "../images/Community/github.png"
import { useNetwork } from "../hooks"
import AppFooter from "../components/AppFooter"

const community = [
  { href: MEDIUM, src: medium, alt: "Medium" },
  { href: DISCORD, src: discord, alt: "Discord" },
  { href: TELEGRAM, src: telegram, alt: "Telegram" },
  { href: WECHAT, src: wechat, alt: "Wechat" },
  { href: GITHUB, src: github, alt: "Github" },
]

const Footer = () => {
  const { name } = useNetwork()
  return <AppFooter network={name} community={community} />
}

export default Footer
