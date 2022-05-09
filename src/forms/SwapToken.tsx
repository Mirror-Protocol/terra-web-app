import React from "react"
import { gt } from "../libs/math"
import { format, lookupSymbol } from "../libs/parse"
import styles from "./SwapToken.module.scss"
import { GetTokenSvg } from "../helpers/token"
import { useContractsAddress } from "hooks/useContractsAddress"

interface Props extends AssetItem {
  contract_addr?: string
  icon: string[]
  verified: boolean
  formatTokenName?: (symbol: string) => string
  highlightString?: string
}

const highlightedText = (text: string, query: string) => {
  if (query) {
    const parts = text.split(new RegExp(`(${query})`, "gi"))

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return text
}

const SwapToken = ({
  symbol,
  balance,
  contract_addr = "",
  icon,
  verified,
  formatTokenName,
  highlightString = "",
}: Props) => {
  const symbols = symbol.split("-")
  const { isNativeToken } = useContractsAddress()

  return (
    <article className={styles.asset}>
      <div className={styles.header}>
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
              <p>
                {highlightedText(
                  (formatTokenName?.(symbols[0]) ?? lookupSymbol(symbols[0])) ||
                    "",
                  highlightString
                )}
              </p>
            </div>
            {verified ? (
              <div className={styles.verified_box}>
                <p className={styles.verified}>verified</p>
              </div>
            ) : undefined}

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
            {symbols.length > 1 && verified ? (
              <div className={styles.verified_box}>
                <p className={styles.verified}>verified</p>
              </div>
            ) : undefined}
          </div>
        </div>
        <div className={styles.token_address}>
          {!isNativeToken(contract_addr) && (
            <span className={styles.address}>
              {highlightedText(contract_addr, highlightString)}
            </span>
          )}
        </div>
      </div>

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
