import ExtLink from "../../components/ExtLink"
import styles from "./ForumLink.module.scss"

const ForumLink = () => {
  return (
    <ExtLink href="https://forum.mirror.finance" className={styles.link}>
      <section className={styles.main}>
        <span>Forum discussion is recommended before poll creation</span>
      </section>
    </ExtLink>
  )
}

export default ForumLink
