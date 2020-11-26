import classNames from "classnames/bind"
import { MIR } from "../../constants"
import { div, gt, plus, times } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { GovKey, useGov, useRefetchGov } from "../../graphql/useGov"
import Progress from "../../components/Progress"
import styles from "./PollVotes.module.scss"

const cx = classNames.bind(styles)

interface Item {
  label: string
  value: string
  amount: string
  color: string
}

const Votes = ({ list, lg }: { list: Item[]; lg?: boolean }) => (
  <section className={cx(styles.votes, { lg, sm: !lg })}>
    {list.map(({ label, value, amount, color }) => (
      <span className={classNames(styles.label, color)} key={label}>
        <strong>{label}</strong>
        <span>{percent(value)}</span>
        <small>{lg && formatAsset(amount, MIR, { integer: true })}</small>
      </span>
    ))}
  </section>
)

interface Props extends Poll {
  lg?: boolean
}

const PollVotes = ({ lg, ...props }: Props) => {
  const { yes_votes, no_votes, total_share_at_end_poll } = props
  const { config, state } = useGov()
  useRefetchGov([GovKey.STATE])

  const votes = {
    yes: yes_votes ?? "0",
    no: no_votes ?? "0",
    total: total_share_at_end_poll ?? "0",
  }

  const parsed = config && state && parseVotes(votes, config, state)

  return !parsed ? null : (
    <>
      <Progress {...parsed} noLabel />
      <Votes list={parsed.data} lg={lg} />
    </>
  )
}

export default PollVotes

/* helpers */
export const parseVotes = (
  { total, ...votes }: { yes: string; no: string; total: string },
  { quorum, ...config }: GovConfig,
  { total_share }: GovState
) => {
  const yes = div(votes["yes"], gt(total, 0) ? total : total_share)
  const no = div(votes["no"], gt(total, 0) ? total : total_share)
  const voted = plus(yes, no)
  const threshold = times(config.threshold, voted)

  return {
    axis: !gt(voted, quorum)
      ? [{ x: quorum, label: "Quorum" }]
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
    ],
  }
}
