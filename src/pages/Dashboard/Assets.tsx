import Tooltips from "../../lang/Tooltips"
import { useDashboard } from "../../data/stats/statistic"
import Formatted from "../../components/Formatted"
import { CardMain } from "../../components/Card"
import Summary from "../../components/Summary"
import styles from "./Assets.module.scss"

const Assets = () => {
  const { assetMarketCap, latest24h } = useDashboard()

  const list = [
    {
      title: "Market Cap",
      tooltip: Tooltips.Dashboard.mAsset.MarketCap,
      children: (
        <Formatted symbol="uusd" integer>
          {assetMarketCap}
        </Formatted>
      ),
    },
    {
      title: "Trading Fee",
      tooltip: Tooltips.Dashboard.mAsset.Fee,
      children: (
        <Formatted symbol="uusd" integer>
          {latest24h.feeVolume}
        </Formatted>
      ),
    },
    {
      title: "Transactions",
      tooltip: Tooltips.Dashboard.mAsset.Transactions,
      children: <Formatted integer>{latest24h.transactions}</Formatted>,
    },
  ]

  return (
    <CardMain className={styles.content}>
      <h1 className={styles.title}>mAsset</h1>
      <ul>
        {list.map((item, index) => (
          <li className={styles.item}>
            <Summary {...item} key={index} />
          </li>
        ))}
      </ul>
    </CardMain>
  )
}

export default Assets
