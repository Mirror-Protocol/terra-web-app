import React from "react"
import styles from "./SwapConfirm.module.scss"

const SwapConfirm = ({ list }: { list: Content[] }) => (
  <ul className={styles.list}>
    {list
      .map((item, key) => ({ ...item, key: `${key}` }))
      .map(({ title, content, key }) => (
        <li className={styles.item} key={key}>
          <article className={styles.article}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.content}>{content}</p>
          </article>
        </li>
      ))}
  </ul>
)

export default SwapConfirm
