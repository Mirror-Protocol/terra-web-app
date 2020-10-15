import React from "react"
import { useRouteMatch } from "react-router-dom"
import Tooltip from "../../lang/Tooltip.json"
import { GovKey, useGov, useRefetchGov } from "../../graphql/useGov"
import Card from "../../components/Card"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import { TooltipIcon } from "../../components/Tooltip"
import PollItem from "./PollItem"
import styles from "./Polls.module.scss"

const Polls = ({ title }: { title: string }) => {
  const { url } = useRouteMatch()
  const { polls, result } = useGov()
  const { list } = polls
  const { loading } = result[GovKey.POLLS]
  useRefetchGov([GovKey.POLLS])

  return (
    <article className={styles.component}>
      <LoadingTitle loading={loading} className={styles.title}>
        <TooltipIcon content={Tooltip.Gov.Polls}>
          <h1>{title}</h1>
        </TooltipIcon>
      </LoadingTitle>

      {!loading && !list.length ? (
        <Card>
          <p className="empty">No polls found</p>
        </Card>
      ) : (
        <Grid wrap={2}>
          {list.map((id) => (
            <Card to={`${url}/poll/${id}`} key={id}>
              <PollItem id={id} />
            </Card>
          ))}
        </Grid>
      )}
    </article>
  )
}

export default Polls
