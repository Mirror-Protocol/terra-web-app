import React from "react"
import classNames from "classnames/bind"
import styles from "./ConfirmDetails.module.scss"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cx = classNames.bind(styles)

interface Props {
  contents?: Content[][]
  result?: boolean
}

const displayStr = (content: any, index: number) => {
  if (!Array.isArray(content)) {
    content = [content]
  }

  const strArray: any[] = []

  content.forEach((src: any) => {
    if (typeof src !== "string" || index !== 0) {
      return
    }
    const strList = src.split(" ")
    if (strList.length === 2) {
      strArray.push({ first: strList[0], second: strList[1] })
    }
  })

  if (strArray.length === 0) {
    return (
      <section className={index !== 0 ? styles.content : styles.txhash}>
        {content}
      </section>
    )
  } else {
    return (
      <div className={styles.content}>
        {strArray.map(({ first, second }, index) => (
          <div className={styles.content0}>
            <section className={styles.content1}>{first}</section>
            <section className={styles.content2}>{second}</section>
          </div>
        ))}
      </div>
    )
  }
}

const ConfirmDetails = ({ contents, result }: Props) =>
  !contents ? null : (
    <ul className={styles.list}>
      {contents.map((contentArray, i) => (
        <li className={styles.item} key={i}>
          {contentArray.map(({ title, content }, j) => (
            <article key={`${i}-${j}`} className={styles.article}>
              <h2 className={j === 0 ? styles.title : styles.title2}>
                {title}
              </h2>
              {displayStr(content, j)}
            </article>
          ))}
        </li>
      ))}
    </ul>
  )

export default ConfirmDetails
