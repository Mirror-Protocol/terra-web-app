import { Content } from "./componentTypes"
import styles from "./Confirm.module.scss"

const Confirm = ({ list }: { list: Content[] }) => (
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

export default Confirm
