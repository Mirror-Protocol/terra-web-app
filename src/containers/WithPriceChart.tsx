import { FC } from "react"
import { useProtocol } from "../data/contract/protocol"
import PriceChart from "./PriceChart"
import styles from "./WithPriceChart.module.scss"

const WithPriceChart: FC<{ token: string }> = ({ token, children }) => {
  const { getSymbol } = useProtocol()

  return (
    <div className={styles.flex}>
      <section className={styles.content}>{children}</section>
      <section className={styles.chart}>
        <PriceChart token={token} symbol={getSymbol(token)} />
      </section>
    </div>
  )
}

export default WithPriceChart
