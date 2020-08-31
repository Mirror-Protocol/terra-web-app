import { truncate } from "../../libs/text"
import ExtLink from "../../components/ExtLink"
import Badge from "../../components/Badge"
import Icon from "../../components/Icon"
import styles from "./HistoryItem.module.scss"

const HistoryItem = ({ txhash, type }: { txhash: string; type: string }) => (
  <article>
    <header className={styles.header}>
      <ExtLink className={styles.hash}>
        {truncate(txhash, [5, 5])}
        <Icon name="launch" size={12} />
      </ExtLink>
    </header>

    <section className={styles.main}>
      <Badge className={styles.badge}>{type}</Badge>
      <p className={styles.message} />
    </section>
  </article>
)

export default HistoryItem
