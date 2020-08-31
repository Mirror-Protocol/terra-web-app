import classNames from "classnames"
import styles from "./TokenPair.module.scss"

interface Props {
  symbol: string
  bg?: string
}

const ICON_SIZE = { width: 25, height: 25 }
const ICON_URL = "https://whitelist.mirror.finance/images"
export const getIcon = (symbol: string) =>
  `${ICON_URL}/${symbol.startsWith("m") ? symbol.slice(1) : symbol}.png`

const TokenPair = ({ symbol, bg = "bg" }: Props) => (
  <section className={styles.images}>
    <div className={classNames(styles.fill, "bg-" + bg)}>
      <img {...ICON_SIZE} src={getIcon(symbol)} alt="" />
    </div>

    <div className={styles.outline}>
      <img {...ICON_SIZE} src={getIcon("UST")} alt="" />
    </div>
  </section>
)

export default TokenPair
