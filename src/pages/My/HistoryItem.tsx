import classNames from "classnames/bind"
import { format as formatDate } from "date-fns"
import { useNetwork } from "../../hooks"
import ExtLink from "../../components/ExtLink"
import Badge from "../../components/Badge"
import Icon from "../../components/Icon"
import useParseTx, { getBadge } from "./useParseTx"
import styles from "./HistoryItem.module.scss"

const cx = classNames.bind(styles)

const HistoryItem = (tx: Tx) => {
  const { txHash, type, datetime } = tx
  const { finder } = useNetwork()
  const parsedTx = useParseTx(tx)

  return (
    <ExtLink href={finder(txHash, "tx")} className={styles.component}>
      <section className={styles.main}>
        <Badge className={styles.badge}>{getBadge(type).toLowerCase()}</Badge>

        {!!parsedTx.length &&
          parsedTx.map((word, index) => (
            <span className={cx({ muted: !(index % 2) })} key={index}>
              {word}{" "}
            </span>
          ))}

        <Icon name="launch" size={16} className={styles.hash} />
      </section>

      <footer className={styles.footer}>
        <Icon name="calendar_today" size={16} />
        {formatDate(new Date(datetime), "LLL dd, yyyy, HH:mm aa")}
      </footer>
    </ExtLink>
  )
}

export default HistoryItem
