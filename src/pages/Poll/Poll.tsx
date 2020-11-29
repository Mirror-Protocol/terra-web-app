import useHash from "../../libs/useHash"
import { GovKey, useRefetchGov } from "../../graphql/useGov"
import Page from "../../components/Page"
import PollForm from "../../forms/PollForm"
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
  useRefetchGov([GovKey.POLLS])
  const { hash: type } = useHash<Type>()
  const tab = { tabs: [Type.END, Type.EXECUTE], current: type }

  return (
    <Page title={MenuKey.POLL}>
      {!type ? <PollDetails /> : <PollForm type={type} tab={tab} key={type} />}
    </Page>
  )
}

export default Poll
