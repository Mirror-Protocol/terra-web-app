import React from "react"
import HistoryItem from "./HistoryItem"
import styles from "./HistoryList.module.scss"

const sample = [
  { txhash: "", type: "" },
  { txhash: "", type: "" },
  { txhash: "", type: "" },
]

const HistoryList = ({ type }: { type?: string }) => {
  const list = sample

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li className={styles.item} key={index}>
          <HistoryItem {...item} />
        </li>
      ))}
    </ul>
  )
}

export default HistoryList
