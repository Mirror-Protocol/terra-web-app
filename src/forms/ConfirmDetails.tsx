import React from "react"
import classNames from "classnames/bind"
import styles from "./ConfirmDetails.module.scss"

const cx = classNames.bind(styles)

interface Props {
  contents?: Content[]
  result?: boolean
}

const ConfirmDetails = ({ contents, result }: Props) =>
  !contents ? null : (
    <ul className={styles.list}>
      {contents.map(({ title, content }, index) => (
        <li className={styles.item} key={index}>
          <article className={styles.article}>
            <h2 className={styles.title}>{title}</h2>
            <section className={cx(styles.content, { result })}>
              {Array.isArray(content) ? content.join("\n") : content}
            </section>
          </article>
        </li>
      ))}
    </ul>
  )

export default ConfirmDetails
