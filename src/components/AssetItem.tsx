import { FC } from "react"
import classNames from "classnames/bind"
import { useProtocol } from "../data/contract/protocol"
import { lookupSymbol } from "../libs/parse"
import AssetIcon from "./AssetIcon"
import Delisted from "./Delisted"
import styles from "./AssetItem.module.scss"

const cx = classNames.bind(styles)

interface Props {
  token: string
  small?: boolean
  idle?: boolean
  formatTokenName?: (symbol: string) => string
}

const AssetItem: FC<Props> = ({ token, small, idle, children, ...props }) => {
  const { whitelist, getSymbol, getIsDelisted } = useProtocol()
  const symbol = getSymbol(token)
  const ticker = props.formatTokenName?.(symbol) ?? lookupSymbol(symbol)
  const name = whitelist[token]?.name

  return (
    <article className={cx(styles.asset, { idle })}>
      <AssetIcon symbol={symbol} small={small} idle={idle} />

      <header className={styles.header}>
        {getIsDelisted(token) && <Delisted />}

        <h1 className={styles.symbol}>{ticker}</h1>

        {children ? (
          <section className={styles.content}>{children}</section>
        ) : name ? (
          <section className={classNames(styles.content, styles.name)}>
            {name}
          </section>
        ) : null}
      </header>
    </article>
  )
}

export default AssetItem
