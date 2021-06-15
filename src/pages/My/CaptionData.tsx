import styles from "./CaptionData.module.scss"

const CaptionData = ({ list }: { list: Content[] }) => {
  return (
    <ul className={styles.list}>
      {list.map(({ title, content }, index) => (
        <li className={styles.item} key={index}>
          <article className={styles.article}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {content && <p className={styles.content}>{content}</p>}
          </article>
        </li>
      ))}
    </ul>
  )
}

export default CaptionData
