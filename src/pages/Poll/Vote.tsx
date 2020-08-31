import { MenuKey } from "../Gov"
import Page from "../../components/Page"
import VoteForm from "../../forms/VoteForm"

const Vote = () => (
  <Page title={MenuKey.VOTE}>
    <VoteForm tab={{ tabs: [MenuKey.VOTE], current: MenuKey.VOTE }} />
  </Page>
)

export default Vote
