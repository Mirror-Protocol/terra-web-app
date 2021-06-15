import Formatted from "../../components/Formatted"
import Card, { CardMain } from "../../components/Card"
import TopTrading from "./TopTrading"
import styles from "./DashboardFooter.module.scss"

const DashboardFooter = ({ latest24h, assetMarketCap }: Dashboard) => {
  return (
    <Card className={styles.card} full lg>
      <CardMain className={styles.content}>
        <h1 className={styles.title}>mAsset</h1>

        <section className={styles.section}>
          <h1 className={styles.title}>Market Cap</h1>
          <Formatted symbol="uusd" config={{ integer: true }}>
            {assetMarketCap}
          </Formatted>
        </section>

        <section className={styles.section}>
          <h1 className={styles.title}>Trading Fee</h1>
          <Formatted symbol="uusd" config={{ integer: true }}>
            {latest24h.feeVolume}
          </Formatted>
        </section>

        <section className={styles.section}>
          <h1 className={styles.title}>Transactions</h1>
          <Formatted config={{ integer: true }}>
            {latest24h.transactions}
          </Formatted>
        </section>
      </CardMain>

      <section className={styles.table}>
        <TopTrading />
      </section>
    </Card>
  )
}

export default DashboardFooter
