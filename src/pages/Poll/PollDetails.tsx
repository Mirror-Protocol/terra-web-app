import { useRouteMatch } from "react-router-dom"
import { gt, plus } from "../../libs/math"
import Card from "../../components/Card"
import Grid from "../../components/Grid"
import PollHeader from "./PollHeader"
import PollMeta from "./PollMeta"
import PollSummary from "./PollSummary"
import PollVotes from "./PollVotes"
import PollVoters from "./PollVoters"
import styles from "./PollDetails.module.scss"

const PollDetails = ({ poll }: { poll: Poll }) => {
  const { params } = useRouteMatch<{ id: string }>()
  const id = Number(params.id)

  return !poll ? null : (
    <>
      <Grid>
        <Card>
          <PollHeader {...poll} titleClassName={styles.title} />
          <PollMeta {...poll} />
        </Card>
      </Grid>

      <Grid>
        <Card>
          <PollSummary {...poll} />
        </Card>
      </Grid>

      <Grid>
        <Card title="Vote Details">
          {!gt(plus(poll.yes_votes, poll.no_votes), 0) ? (
            <p className="empty">No votes found</p>
          ) : (
            <PollVotes {...poll} lg />
          )}

          <PollVoters id={id} />
        </Card>
      </Grid>
    </>
  )
}

export default PollDetails
