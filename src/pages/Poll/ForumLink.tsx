import ExtLink from "../../components/ExtLink"
import Icon from "../../components/Icon"
import styles from "./ForumLink.module.scss"

const ForumLink = () => {
  return (
    <ExtLink href="https://forum.mirror.finance" className={styles.link}>
      <section className={styles.main}>
        <Icon name="question_answer" size={20} />
        <span>Forum discussion is recommended before poll creation</span>
      </section>

      <Icon name="chevron_right" size={20} className={styles.caret} />
    </ExtLink>
  )
}

export default ForumLink
