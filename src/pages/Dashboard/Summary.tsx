import { useDashboard } from "../../data/stats/statistic"
import Formatted from "../../components/Formatted"
import { CardMain } from "../../components/Card"
import styles from "./Summary.module.scss"

const Summary = () => {
  const { assetMarketCap, latest24h } = useDashboard()

  return (
    <CardMain className={styles.content}>
      <h1 className={styles.title}>mAsset</h1>

      <section className={styles.section}>
        <h1 className={styles.title}>Market Cap</h1>
        <p className={styles.number}>
          <Formatted symbol="uusd" config={{ integer: true }}>
            {assetMarketCap}
          </Formatted>
        </p>
      </section>

      <section className={styles.section}>
        <h1 className={styles.title}>Trading Fee</h1>
        <p className={styles.number}>
          <Formatted symbol="uusd" config={{ integer: true }}>
            {latest24h.feeVolume}
          </Formatted>
        </p>
      </section>

      <section className={styles.section}>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.number}>
          <Formatted config={{ integer: true }}>
            {latest24h.transactions}
          </Formatted>
        </p>
      </section>
    </CardMain>
  )
}

export default Summary
