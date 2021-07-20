import { MenuKey } from "../Gov/Gov"
import Page from "../../components/Page"
import VoteForm from "../../forms/VoteForm"

const Vote = () => (
  <Page>
    <VoteForm tab={{ tabs: [MenuKey.VOTE], current: MenuKey.VOTE }} />
  </Page>
)

export default Vote
