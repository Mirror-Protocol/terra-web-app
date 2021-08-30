import { useEffect, useMemo, useState } from "react"
import classNames from "classnames"
import { intervalToDuration, startOfSecond } from "date-fns"
import ResultFooter from "../../components/ResultFooter"
import { ReactComponent as Icon } from "./Queued.svg"
import TxHash from "./TxHash"
import styles from "./Broadcasting.module.scss"

const Broadcasting = ({ txhash }: { txhash: string }) => {
  const fromLastSeen = useFromLastSeen()

  return (
    <article className={styles.component}>
      <div className={styles.card}>
        <section className={styles.processing}>
          <div className={classNames(styles.item, styles.text)}>
            <h2>Queued</h2>
          </div>

          <div className={classNames(styles.item, styles.icons)}>
            <Icon className={styles.icon} />
          </div>
        </section>

        <p className={styles.timestamp}>{fromLastSeen}</p>
        <p className={styles.desc}>This transaction is in process</p>

        <footer className={styles.footer}>
          <ResultFooter
            list={[{ title: "Tx Hash", content: <TxHash>{txhash}</TxHash> }]}
          />
        </footer>
      </div>
    </article>
  )
}

export default Broadcasting

/* hooks */
const useFromLastSeen = () => {
  const lastSeen = useMemo(() => startOfSecond(new Date()), [])
  const [now, setNow] = useState(lastSeen)

  useEffect(() => {
    setInterval(() => setNow(startOfSecond(new Date())), 1000)
  }, [])

  const { minutes, seconds } = intervalToDuration({ start: lastSeen, end: now })
  return [minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":")
}
