import classNames from "classnames/bind"
import { isPast } from "../../libs/date"
import { Poll, PollStatus } from "../../data/gov/poll"
import Icon from "../../components/Icon"
import styles from "./PollHeader.module.scss"

const cx = classNames.bind(styles)

interface Props extends Poll {
  titleClassName?: string
}

const PollHeader = ({ titleClassName, ...props }: Props) => {
  const { id, type, title, status, end_time } = props

  const icons: Record<PollStatus, IconNames> = {
    [PollStatus.InProgress]: "PollSolid",
    [PollStatus.Passed]: "ArrowRightCircleSolid",
    [PollStatus.Rejected]: "CloseCircleSolid",
    [PollStatus.Executed]: "VerifiedSolid",
  }

  return (
    <header className={styles.header}>
      <section className={styles.meta}>
        <span className={styles.id}>ID: {id}</span>
        <span className={styles.type}>{type}</span>
      </section>

      <section
        className={cx(styles.status, {
          blue: [PollStatus.Passed, PollStatus.Executed].includes(status),
          red: status === PollStatus.Rejected,
          strike: status === PollStatus.InProgress && isPast(end_time),
        })}
      >
        <Icon name={icons[status as PollStatus]} size={18} />
        {status.replace("_", " ")}
      </section>

      <h1 className={classNames(styles.title, titleClassName)}>{title}</h1>
    </header>
  )
}

export default PollHeader
