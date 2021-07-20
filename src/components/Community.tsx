import medium from "./Community/medium.png"
import discord from "./Community/discord.png"
import telegram from "./Community/telegram.png"
import twitter from "./Community/twitter.png"
import github from "./Community/github.png"

import ExtLink from "./ExtLink"
import styles from "./Community.module.scss"

interface Props {
  network?: string
  project: string
}

const Community = ({ network, project }: Props) => {
  const community = [
    {
      href: `https://github.com/Mirror-Protocol/${project}`,
      src: github,
      alt: "Github",
    },
    {
      href: "https://medium.com/@mirror-protocol",
      src: medium,
      alt: "Medium",
    },
    {
      href: "https://t.me/mirror_protocol",
      src: telegram,
      alt: "Telegram",
    },
    {
      href: "https://discord.gg/KYC22sngFn",
      src: discord,
      alt: "Discord",
    },
    {
      href: "https://twitter.com/mirror_protocol",
      src: twitter,
      alt: "Twitter",
    },
  ]

  return (
    <footer className={styles.footer}>
      <section className={styles.community}>
        {community.map(
          ({ href, src, alt }) =>
            href && (
              <ExtLink href={href} className={styles.link} key={alt}>
                <img src={src} alt={alt} width={18} height={18} />
              </ExtLink>
            )
        )}
      </section>
    </footer>
  )
}

export default Community
