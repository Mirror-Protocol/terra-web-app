import Button from "../../components/Button"
import Card from "../../components/Card"
import useTxs from "../../statistics/useTxs"
import HistoryItem from "./HistoryItem"
import styles from "./HistoryList.module.scss"

const HistoryList = () => {
  const { txs, loading, more } = useTxs()

  return !txs.length ? null : (
    <Card title="Transaction History" loading={loading}>
      <ul className={styles.list}>
        {txs
          .filter(({ txHash }) => txHash)
          .map((item, index) => (
            <li className={styles.item} key={index}>
              <HistoryItem {...item} />
            </li>
          ))}
      </ul>

      {more && (
        <Button onClick={more} block outline submit>
          More
        </Button>
      )}
    </Card>
  )
}

export default HistoryList
