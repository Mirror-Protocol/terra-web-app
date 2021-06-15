import { format as formatDate } from "date-fns"
import { FMT } from "../../constants"
import classNames from "classnames"
import { useNetwork } from "../../hooks"
import ExtLink from "../../components/ExtLink"
import Icon from "../../components/Icon"
import useParseTx, { getBadge } from "./useParseTx"
import styles from "./HistoryItem.module.scss"

const HistoryItem = (tx: Tx) => {
  const { txHash, type, datetime } = tx
  const { finder } = useNetwork()
  const parsedTx = useParseTx(tx)

  return (
    <ExtLink href={finder(txHash, "tx")} className={styles.component}>
      <header className={styles.main}>
        <section className={styles.badge}>{getBadge(type)}</section>

        <section className={styles.link}>
          {!!parsedTx.length &&
            parsedTx.map((word, index) => {
              const strong = index % 2
              return strong ? (
                <strong key={index}>{word} </strong>
              ) : (
                <span key={index}>{word} </span>
              )
            })}

          <Icon name="External" size={14} className={styles.hash} />
        </section>
      </header>

      <footer className={classNames(styles.footer, "desktop")}>
        {formatDate(new Date(datetime), FMT.HHmm)}
      </footer>
    </ExtLink>
  )
}

export default HistoryItem
