import { FC } from "react"
import classNames from "classnames"
import { useProtocol } from "../data/contract/protocol"
import { lookupSymbol } from "../libs/parse"
import AssetIcon from "./AssetIcon"
import Delisted from "./Delisted"
import styles from "./AssetItem.module.scss"

interface Props {
  token: string
  small?: boolean
  formatTokenName?: (symbol: string) => string
}

const AssetItem: FC<Props> = ({ token, formatTokenName, small, children }) => {
  const { whitelist, getSymbol, getIsDelisted } = useProtocol()
  const symbol = getSymbol(token)
  const name = whitelist[token]?.name

  return (
    <div className={styles.asset}>
      <AssetIcon symbol={symbol} small={small} />

      <header className={styles.title}>
        {getIsDelisted(token) && <Delisted />}

        <h1 className={styles.symbol}>
          {formatTokenName?.(symbol) ?? lookupSymbol(symbol)}
        </h1>

        {children ? (
          <section className={styles.content}>{children}</section>
        ) : name ? (
          <section className={classNames(styles.content, styles.name)}>
            {name}
          </section>
        ) : null}
      </header>
    </div>
  )
}

export default AssetItem
