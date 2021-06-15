import { isEmphasizedPoll } from "./pollHelpers"
import usePollTimeText from "./usePollTimeText"
import PollHeader from "./PollHeader"
import PollVotes from "./PollVotes"
import styles from "./PollItem.module.scss"

const PollItem = (poll: Poll) => {
  const pollTimeText = usePollTimeText(poll)

  return !poll ? null : (
    <article className={styles.component}>
      <section className={styles.main}>
        <PollHeader {...poll} titleClassName={styles.title} />
        <PollVotes {...poll} />
      </section>

      <footer className={styles.footer}>
        <strong>{pollTimeText.label}: </strong>
        {pollTimeText.text}
        {isEmphasizedPoll(poll) && ` (${pollTimeText.toNow})`}
      </footer>
    </article>
  )
}

export default PollItem
