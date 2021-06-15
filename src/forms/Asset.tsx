import AssetItem from "../components/AssetItem"
import Icon from "../components/Icon"
import { gt } from "../libs/math"
import { format } from "../libs/parse"
import styles from "./Asset.module.scss"

interface Props extends AssetItemProps {
  formatTokenName?: (symbol: string) => string
}

const Asset = ({ symbol, name, status, price, balance, ...props }: Props) => {
  return (
    <article className={styles.asset}>
      <header className={styles.header}>
        <AssetItem {...props} small />
      </header>

      <footer className={styles.footer}>
        {price && gt(price, 0) && name !== "UST" && (
          <p className={styles.price}>{format(price)} UST</p>
        )}

        {balance && gt(balance, 0) && (
          <p className={styles.balance}>
            <Icon name="Wallet" size={16} />
            <strong>{format(balance, symbol)}</strong>
          </p>
        )}
      </footer>
    </article>
  )
}

export default Asset
