import { useRouteMatch } from "react-router-dom"
import { GovKey, usePoll, useRefetchGov } from "../../graphql/useGov"
import Page from "../../components/Page"
import { MenuKey } from "../Gov"
import PollDetails from "./PollDetails"

export enum Type {
  "END" = "end",
  "EXECUTE" = "execute",
}

export enum PollStatus {
  InProgress = "in_progress",
  Passed = "passed",
  Rejected = "rejected",
  Executed = "executed",
}

const Poll = () => {
  const { params } = useRouteMatch<{ id: string }>()
  const id = Number(params.id)

  useRefetchGov([GovKey.POLLS])

  const { poll } = usePoll(id)

  return !poll ? null : (
    <Page title={MenuKey.POLL}>
      <PollDetails poll={poll} />
    </Page>
  )
}

export default Poll
