import { useGov } from "../../graphql/useGov"
import Icon from "../../components/Icon"
import { isEmphasizedPoll } from "./pollHelpers"
import useEstimateTime from "./useEstimateTime"
import PollHeader from "./PollHeader"
import PollVotes from "./PollVotes"
import styles from "./PollItem.module.scss"

const PollItem = ({ id }: { id: number }) => {
  const { polls } = useGov()
  const poll = polls.data[id]
  const estimatedTime = useEstimateTime(poll)
  const toNow = (
    <>
      <Icon name="schedule" size={18} />
      {estimatedTime.toNow}
    </>
  )

  return !poll ? null : (
    <article className={styles.component}>
      <section className={styles.main}>
        <PollHeader {...poll} titleClassName={styles.title} />
        <PollVotes {...poll} />
      </section>

      <footer className={styles.footer}>
        <strong>{estimatedTime.label}: </strong>
        {estimatedTime.text}
        {isEmphasizedPoll(poll) && toNow}
      </footer>
    </article>
  )
}

export default PollItem
