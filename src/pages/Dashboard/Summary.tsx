import Tooltips from "../../lang/Tooltips"
import { useDashboard } from "../../data/stats/statistic"
import Formatted from "../../components/Formatted"
import { CardMain } from "../../components/Card"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./Summary.module.scss"

const Summary = () => {
  const { assetMarketCap, latest24h } = useDashboard()

  const list = [
    {
      title: "Market Cap",
      tooltip: Tooltips.Dashboard.mAsset.MarketCap,
      content: (
        <Formatted symbol="uusd" config={{ integer: true }}>
          {assetMarketCap}
        </Formatted>
      ),
    },
    {
      title: "Trading Fee",
      tooltip: Tooltips.Dashboard.mAsset.Fee,
      content: (
        <Formatted symbol="uusd" config={{ integer: true }}>
          {latest24h.feeVolume}
        </Formatted>
      ),
    },
    {
      title: "Transactions",
      tooltip: Tooltips.Dashboard.mAsset.Transactions,
      content: (
        <Formatted config={{ integer: true }}>
          {latest24h.transactions}
        </Formatted>
      ),
    },
  ]

  return (
    <CardMain className={styles.content}>
      <h1 className={styles.title}>mAsset</h1>
      {list.map(({ title, content, tooltip }) => (
        <section className={styles.section} key={title}>
          <h1 className={styles.title}>
            <TooltipIcon content={tooltip}>{title}</TooltipIcon>
          </h1>
          <p className={styles.number}>{content}</p>
        </section>
      ))}
    </CardMain>
  )
}

export default Summary
