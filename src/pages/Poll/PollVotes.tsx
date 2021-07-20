import classNames from "classnames"
import { div, gt, max, sum, times } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { useGovConfig } from "../../data/gov/config"
import { useGovState } from "../../data/gov/state"
import { Poll } from "../../data/gov/poll"
import Progress from "../../components/Progress"
import styles from "./PollVotes.module.scss"

interface Item {
  label: string
  value: string
  amount: string
  color: string
}

interface VotesProps {
  list: Item[]
}

const Votes = ({ list }: VotesProps) => (
  <div className={styles.wrapper}>
    <section className={styles.votes}>
      {list.map(({ label, value, amount, color }) => (
        <span className={classNames(styles.label, color)} key={label}>
          <strong className={styles.answer}>{label}</strong>
          <span>{percent(value)}</span>
          <small>{formatAsset(amount, "MIR", { integer: true })}</small>
        </span>
      ))}
    </section>
  </div>
)

interface Props extends Poll {
  lg?: boolean
}

const PollVotes = ({ lg, ...props }: Props) => {
  const { yes_votes, no_votes, abstain_votes, total_balance_at_end_poll } =
    props
  const state = useGovState()
  const config = useGovConfig()

  const sumVotes = sum([yes_votes ?? 0, no_votes ?? 0, abstain_votes ?? 0])
  const safeTotal = max([sumVotes, total_balance_at_end_poll ?? 0])

  const votes = {
    yes: yes_votes ?? "0",
    no: no_votes ?? "0",
    abstain: abstain_votes ?? "0",
    total: total_balance_at_end_poll ? safeTotal : "0",
  }

  const parsed = config && state && parseVotes(votes, config, state)

  return !parsed ? null : (
    <>
      <Progress {...parsed} noLabel />
      {lg && <Votes list={parsed.data} />}
    </>
  )
}

export default PollVotes

/* helpers */
export const parseVotes = (
  votes: { yes: string; no: string; abstain: string; total: string },
  { quorum, ...config }: GovConfig,
  { total_share }: GovState
) => {
  const { total } = votes
  const yes = div(votes["yes"], gt(total, 0) ? total : total_share)
  const no = div(votes["no"], gt(total, 0) ? total : total_share)
  const abstain = div(votes["abstain"], gt(total, 0) ? total : total_share)
  const voted = sum([yes, no, abstain])
  const threshold = times(config.threshold, voted)

  return {
    voted,
    quorum,
    axis: !gt(voted, quorum)
      ? [{ x: quorum, label: `Quorum ${percent(quorum, -1)}` }]
      : [{ x: threshold, label: "Threshold" }],
    data: [
      {
        label: "yes",
        value: yes,
        amount: votes["yes"],
        color: "blue" as const,
      },
      {
        label: "no",
        value: no,
        amount: votes["no"],
        color: "red" as const,
      },
      {
        label: "abstain",
        value: abstain,
        amount: votes["abstain"],
        color: "gray" as const,
      },
    ],
  }
}
