import Button from "../../components/Button"
import Card from "../../components/Card"
import { UUSD } from "../../constants"
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
          .filter(
            ({ type, data }) =>
              !["TERRA_SEND", "TERRA_RECEIVE"].includes(type) ||
              data.denom === UUSD
          )
          .filter(
            ({ type, data }) =>
              type !== "TERRA_SWAP" ||
              [data.offer, data.swapCoin].some((string) =>
                string.endsWith(UUSD)
              )
          )
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
