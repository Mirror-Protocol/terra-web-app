import { Link } from "react-router-dom"
import Icon from "../../components/Icon"
import styles from "./CreatePollButton.module.scss"

interface Props {
  hash: string
  title: string
  desc: string
}

const CreatePollButton = ({ hash, title, desc }: Props) => {
  return (
    <Link to={{ hash }} className={styles.link}>
      <article>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.desc}>{desc}</p>
      </article>

      <Icon name="chevron_right" size={24} />
    </Link>
  )
}

export default CreatePollButton
