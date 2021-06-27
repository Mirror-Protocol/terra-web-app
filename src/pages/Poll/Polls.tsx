import { useState } from "react"
import { useRouteMatch } from "react-router-dom"
import classNames from "classnames/bind"

import Tooltips from "../../lang/Tooltips"
import { usePolls } from "../../data/gov/polls"
import { PollStatus } from "../../data/gov/poll"
import { useParsePoll } from "../../data/gov/parse"
import { useGetVoted } from "../../data/gov/vote"

import Card from "../../components/Card"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import Button, { Submit } from "../../components/Button"
import { TooltipIcon } from "../../components/Tooltip"
import Icon from "../../components/Icon"
import Checkbox from "../../components/Checkbox"

import { isEmphasizedPoll } from "./pollHelpers"
import PollItem from "./PollItem"
import styles from "./Polls.module.scss"

const cx = classNames.bind(styles)

const Polls = ({ title }: { title: string }) => {
  const { url } = useRouteMatch()
  const { idle, data, more } = usePolls()
  const parsePoll = useParsePoll()
  const getVoted = useGetVoted()

  const [showUnvotedOnly, setShowUnvotedOnly] = useState(false)
  const [filter, setFilter] = useState<PollStatus | "">("")

  return idle ? null : (
    <article className={styles.component}>
      <header className={styles.header}>
        <LoadingTitle className={styles.title}>
          <TooltipIcon content={Tooltips.Gov.Polls}>
            <h1>{title}</h1>
          </TooltipIcon>
        </LoadingTitle>

        <div className={styles.wrapper}>
          <button
            type="button"
            className={styles.checkbox}
            onClick={() => setShowUnvotedOnly(!showUnvotedOnly)}
          >
            <Checkbox checked={showUnvotedOnly}>Hide voted polls</Checkbox>
          </button>
          <select
            className={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value as PollStatus)}
          >
            <option value="">All</option>
            {Object.values(PollStatus).map((value) => (
              <option value={value} key={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </select>

          <Icon name="ChevronDown" size={8} />
        </div>
      </header>

      <Grid wrap={2}>
        {data
          .filter(
            ({ id, status }) =>
              !showUnvotedOnly ||
              (!getVoted(id) && status === PollStatus.InProgress)
          )
          .filter(({ status }) => !filter || status === filter)
          .map(parsePoll)
          .map((poll) => {
            const { id } = poll
            const dim = !filter && !isEmphasizedPoll(poll)

            return (
              <Card to={`${url}/poll/${id}`} className={cx({ dim })} key={id}>
                <PollItem {...poll} />
              </Card>
            )
          })}
      </Grid>

      {more && (
        <Submit>
          <Button onClick={more} color="secondary">
            More
          </Button>
        </Submit>
      )}
    </article>
  )
}

export default Polls
