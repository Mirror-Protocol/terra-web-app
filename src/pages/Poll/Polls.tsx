import { useState } from "react"
import { useRouteMatch } from "react-router-dom"
import classNames from "classnames/bind"
import Tooltip from "../../lang/Tooltip.json"
import { GovKey, LIMIT, useGov, useRefetchGov } from "../../graphql/useGov"
import Card from "../../components/Card"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import Button from "../../components/Button"
import Icon from "../../components/Icon"
import { TooltipIcon } from "../../components/Tooltip"
import { isEmphasizedPoll } from "./pollHelpers"
import { PollStatus } from "./Poll"
import PollItem from "./PollItem"
import styles from "./Polls.module.scss"

const cx = classNames.bind(styles)

const Polls = ({ title }: { title: string }) => {
  const [filter, setFilter] = useState<PollStatus | "">("")

  const { url } = useRouteMatch()
  const { polls, result } = useGov()
  const { list, more, offset } = polls
  const { loading } = result[GovKey.POLLS]
  useRefetchGov([GovKey.POLLS])

  return (
    <article className={styles.component}>
      <header className={styles.header}>
        <LoadingTitle loading={loading} className={styles.title}>
          <TooltipIcon content={Tooltip.Gov.Polls}>
            <h1>{title}</h1>
          </TooltipIcon>
        </LoadingTitle>

        <div className={styles.wrapper}>
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
          <Icon name="arrow_drop_down" size={16} />
        </div>
      </header>

      {!loading && !list.length ? (
        <Card>
          <p className="empty">No polls found</p>
        </Card>
      ) : (
        <Grid wrap={2}>
          {list
            .filter((id) => !filter || polls.data[id].status === filter)
            .map((id) => {
              const dim = !filter && !isEmphasizedPoll(polls.data[id])

              return (
                <Card to={`${url}/poll/${id}`} className={cx({ dim })} key={id}>
                  <PollItem id={id} />
                </Card>
              )
            })}
        </Grid>
      )}

      {(!offset || offset - 1 > LIMIT) && (
        <Button onClick={more} block outline submit>
          More
        </Button>
      )}
    </article>
  )
}

export default Polls
