import React from "react"
import { gt } from "../libs/math"
import { format, lookupSymbol } from "../libs/parse"
import styles from "./SwapToken.module.scss"
import { GetTokenSvg } from "../helpers/token"

interface Props extends AssetItem {
  contract_addr?: string
  icon: string[]
  formatTokenName?: (symbol: string) => string
}

const SwapToken = ({
  symbol,
  balance,
  contract_addr,
  icon,
  formatTokenName,
}: Props) => {
  const symbols = symbol.split("-")

  return (
    <article className={styles.asset}>
      <header className={styles.header}>
        <div className={styles.symbol_name}>
          <div className={styles.symbol}>
            <img
              className={styles.logo}
              src={GetTokenSvg(icon[0], symbols[0])}
              width={25}
              height={25}
              alt=""
            />
            <div className={styles.name}>
              <p>{formatTokenName?.(symbols[0]) ?? lookupSymbol(symbols[0])}</p>
            </div>
            {symbols.length > 1 ? (
              <div className={styles.divide}>
                <span>-</span>
              </div>
            ) : undefined}
            {symbols.length > 1 ? (
              <img
                className={styles.logo}
                src={GetTokenSvg(icon[1], symbols[1])}
                width={25}
                height={25}
                alt=""
              />
            ) : undefined}
            {symbols.length > 1 ? (
              <div className={styles.name}>
                <p>
                  {formatTokenName?.(symbols[1]) ?? lookupSymbol(symbols[1])}
                </p>
              </div>
            ) : undefined}
          </div>
        </div>
        <div className={styles.token_address}>
          <p className={styles.address}>{contract_addr}</p>
        </div>
      </header>

      <footer className={styles.footer}>
        {balance && gt(balance, 0) && (
          <p className={styles.balance}>
            Balance: <strong>{format(balance, symbol)}</strong>
          </p>
        )}
      </footer>
    </article>
  )
}

export default SwapToken
