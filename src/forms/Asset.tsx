import { UST } from "../constants"
import { gt } from "../libs/math"
import { format, lookupSymbol } from "../libs/parse"
import styles from "./Asset.module.scss"

interface Props extends AssetItem {
  formatTokenName?: (symbol: string) => string
}

const Asset = ({ symbol, name, price, balance, formatTokenName }: Props) => (
  <article className={styles.asset}>
    <header className={styles.header}>
      <h1 className={styles.symbol}>
        {formatTokenName?.(symbol) ?? lookupSymbol(symbol)}
      </h1>

      {name !== UST && <h2 className={styles.name}>{name}</h2>}
    </header>

    <footer className={styles.footer}>
      {price && gt(price, 0) && name !== UST && (
        <p className={styles.price}>
          {format(price)} {UST}
        </p>
      )}

      {balance && gt(balance, 0) && (
        <p className={styles.balance}>
          Balance: <strong>{format(balance, symbol)}</strong>
        </p>
      )}
    </footer>
  </article>
)

export default Asset
