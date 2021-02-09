import { useParams, useRouteMatch } from "react-router-dom"
import classNames from "classnames"
import { useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import LinkButton from "../../components/LinkButton"
import Icon from "../../components/Icon"
import { useGov } from "../../graphql/useGov"
import { PollStatus } from "./Poll"
import styles from "./PollHeader.module.scss"

interface Props extends Poll {
  titleClassName?: string
}

const PollHeader = ({ titleClassName, ...props }: Props) => {
  const { id, type, title, status, end_height } = props

  const icons: Record<PollStatus, string> = {
    [PollStatus.InProgress]: "how_to_vote",
    [PollStatus.Passed]: "check_circle",
    [PollStatus.Rejected]: "cancel",
    [PollStatus.Executed]: "verified",
  }

  const { url } = useRouteMatch()
  const params = useParams<{ id: string }>()
  const { parsed } = useContract()
  const { polls } = useGov()
  const { height } = polls
  const end = height && height > end_height

  useRefetch([BalanceKey.MIRGOVSTAKED])

  const alreadyVoted = parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance.some(
    ([lockedId]: LockedBalance) => id === lockedId
  )

  return (
    <header className={styles.header}>
      <section className={styles.wrapper}>
        <section className={styles.meta}>
          <span className={styles.id}>ID: {id}</span>
          <span className={styles.type}>{type}</span>
        </section>

        {params.id && !end && (
          <LinkButton
            to={url + "/vote"}
            className="desktop"
            disabled={alreadyVoted}
          >
            {alreadyVoted ? "Voted" : "Vote"}
          </LinkButton>
        )}
      </section>

      <section
        className={classNames(styles.status, {
          blue: status === PollStatus.Passed,
          red: status === PollStatus.Rejected,
          strike: status === PollStatus.InProgress && end,
        })}
      >
        <Icon name={icons[status as PollStatus]} size={20} />
        {status.replace("_", " ")}
      </section>

      <h1 className={classNames(styles.title, titleClassName)}>{title}</h1>
    </header>
  )
}

export default PollHeader
