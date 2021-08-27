import classNames from "classnames"
import Icon from "../../components/Icon"
import ResultFooter from "../../components/ResultFooter"
import TxHash from "./TxHash"
import styles from "./Broadcasting.module.scss"

const Broadcasting = ({ txhash }: { txhash: string }) => {
  return (
    <article className={styles.component}>
      <div className={styles.card}>
        <section className={styles.processing}>
          <div className={classNames(styles.item, styles.text)}>
            <h2>Queued</h2>
          </div>

          <div className={classNames(styles.item, styles.icons)}>
            <Icon name="ChevronRight" className={styles.icon} />
            <Icon name="ChevronRight" className={styles.icon} />
            <Icon name="ChevronRight" className={styles.icon} />
          </div>

          <div className={classNames(styles.item, styles.text, styles.muted)}>
            <h2>Processed</h2>
          </div>
        </section>

        <p className={styles.desc}>
          The transaction has been successfully queued and will be processed
          shortly.
        </p>

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
