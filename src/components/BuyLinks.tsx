import { ReactNode } from "react"
import classNames from "classnames/bind"
import ExtLink from "./ExtLink"
import Icon from "./Icon"
import { ReactComponent as KuCoin } from "./KuCoin.svg"
import styles from "./BuyLinks.module.scss"

const cx = classNames.bind(styles)

export const ICON_SIZE = { width: 15, height: 16 }
const KUCOIN = {
  icon: <KuCoin className={styles.kucoin} {...ICON_SIZE} />,
  name: "KuCoin",
  attrs: { href: "https://trade.kucoin.com/USDT-UST" },
}

interface Link {
  icon: ReactNode
  name: string
  attrs: { href: string } | { onClick: () => void }
}

interface Props {
  type?: "terra" | "eth"
  action?: ReactNode
  className?: string
  onClick?: () => void
  links?: Link[]
}

const BuyLinks = ({ type = "terra", ...props }: Props) => {
  const { action, links = [], className, onClick } = props
  const arrow = <Icon name="External" size={16} />

  return (
    <article className={className}>
      <header className={styles.header}>
        <h1>Where to buy UST</h1>
        {action}
      </header>

      <section className={styles.main}>
        {[...links, KUCOIN].map(({ icon, name, attrs }) => {
          const content = (
            <>
              {icon}
              <span className={styles.name}>{name}</span>
              {arrow}
            </>
          )

          return "href" in attrs ? (
            <ExtLink
              href={attrs.href}
              className={cx(styles.button, type)}
              onClick={onClick}
              key={name}
            >
              {content}
            </ExtLink>
          ) : (
            <button
              className={cx(styles.button, type)}
              onClick={attrs.onClick}
              key={name}
            >
              {content}
            </button>
          )
        })}
      </section>
    </article>
  )
}

export default BuyLinks
