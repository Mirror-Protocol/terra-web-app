import React from "react"
import styles from "./SwapConfirm.module.scss"

const SwapConfirm = ({ list }: { list: Content[] }) => (
  <ul className={styles.list}>
    {list.map(({ title, content }, index) => (
      <li className={styles.item} key={index}>
        <article className={styles.article}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.content}>{content}</p>
        </article>
      </li>
    ))}
  </ul>
)

export default SwapConfirm
